import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/authGuard";


// ================== GET ==================
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    console.log("➡️ [GET] Trip ID:", id);

    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        id,
        title,
        description,
        price,
        currency,
        duration,
        duration_unit,
        priceLevel,
        cover_image,
        gallery_images,
        trip_cities (
          id,
          city_id,
          cities ( id, name )
        ),
        trip_categories (
          id,
          category_id,
          categories ( id, name )
        ),
        includes (
          id,
          include_translations
        ),
        trip_days (
          id,
          day_number,
          day_activities (
            id,
            time,
            activity_translations
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    console.log("➡️ [GET] Raw data:", data);

    if (error) {
      console.error("❌ [GET] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }
    if (!data) {
      console.warn("⚠️ [GET] Trip not found");
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 },
      );
    }

    // ✅ رجّع العلاقات كاملة بدل تحويلها لأسماء فقط
    const trip = {
      ...data,
      cities:
        data.trip_cities?.map((c) => ({
          id: c.city_id,
          name: c.cities?.name, // هترجع كل الترجمات لو مخزنة كـ JSON
        })) || [],
      categories:
        data.trip_categories?.map((c) => ({
          id: c.category_id,
          name: c.categories?.name,
        })) || [],
      includes: data.includes || [],
      itinerary:
        data.trip_days?.map((day) => ({
          id: day.id,
          day_number: day.day_number,
          activities: day.day_activities || [],
        })) || [],
    };

    console.log("✅ [GET] Final trip object:", trip);

    return NextResponse.json({ success: true, trip }, { status: 200 });
  } catch (error) {
    console.error("❌ [GET] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ================== PUT ==================
export async function PUT(req, context) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const { id } = await context.params;
    const body = await req.json();
    const ensure = (result) => {
      if (result.error) throw result.error;
      return result;
    };

    // ✅ تحديث بيانات الرحلة الأساسية فقط لو اتغيرت
    const tripPayload = {};
    const fields = ["title","description","price","duration","priceLevel","cover_image","gallery_images"];
    fields.forEach(f => {
      if (body[f] !== undefined) tripPayload[f] = body[f];
    });

    if (Object.keys(tripPayload).length > 0) {
      const { error } = await supabase
        .from("trips")
        .update(tripPayload)
        .eq("id", id);
      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      }
    }

    // ✅ تحديث الفئات بدون تكرار
    if (Array.isArray(body.categories)) {
      const { data: oldCategories, error: categoriesFetchError } = await supabase
        .from("trip_categories")
        .select("category_id")
        .eq("trip_id", id);
      if (categoriesFetchError) throw categoriesFetchError;

      const oldCategoryIds = oldCategories.map(c => c.category_id);
      const newCategories = [...new Set(body.categories)];

      const toAdd = newCategories.filter(c => !oldCategoryIds.includes(c));
      const toRemove = oldCategoryIds.filter(c => !newCategories.includes(c));

      if (toAdd.length > 0) {
        ensure(await supabase.from("trip_categories").insert(toAdd.map(catId => ({ trip_id: id, category_id: catId }))));
      }
      if (toRemove.length > 0) {
        ensure(await supabase.from("trip_categories").delete().eq("trip_id", id).in("category_id", toRemove));
      }
    }

    // ✅ تحديث المدن بدون تكرار
    if (Array.isArray(body.cities)) {
      const { data: oldCities, error: citiesFetchError } = await supabase
        .from("trip_cities")
        .select("city_id")
        .eq("trip_id", id);
      if (citiesFetchError) throw citiesFetchError;

      const oldCityIds = oldCities.map(c => c.city_id);
      const newCities = [...new Set(body.cities)];

      const toAdd = newCities.filter(c => !oldCityIds.includes(c));
      const toRemove = oldCityIds.filter(c => !newCities.includes(c));

      if (toAdd.length > 0) {
        ensure(await supabase.from("trip_cities").insert(toAdd.map(cityId => ({ trip_id: id, city_id: cityId }))));
      }
      if (toRemove.length > 0) {
        ensure(await supabase.from("trip_cities").delete().eq("trip_id", id).in("city_id", toRemove));
      }
    }

    // ✅ تحديث الـ includes بدون تكرار نصوص
    if (Array.isArray(body.includes)) {
      const seen = new Set();
      const uniqueIncludes = body.includes.filter(inc => {
        const key = JSON.stringify(inc.include_translations);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // احذف القديم كله وأدخل الجديد النظيف
      ensure(await supabase.from("includes").delete().eq("trip_id", id));
      if (uniqueIncludes.length > 0) {
        ensure(await supabase.from("includes").insert(uniqueIncludes.map(inc => ({
          trip_id: id,
          include_translations: inc.include_translations
        }))));
      }
    }

    // ✅ تحديث الأيام والأنشطة اليومية بدون تكرار
    if (Array.isArray(body.itinerary)) {
      ensure(await supabase.from("trip_days").delete().eq("trip_id", id));

      const seenDays = new Set();
      const uniqueDays = body.itinerary.filter(day => {
        if (seenDays.has(day.day_number)) return false;
        seenDays.add(day.day_number);
        return true;
      });

      const daysData = uniqueDays.map((day, index) => ({
        trip_id: id,
        day_number: day.day_number || index + 1,
      }));

      const { data: insertedDays, error: daysError } = await supabase
        .from("trip_days")
        .insert(daysData)
        .select();

      if (daysError) throw daysError;

      const activitiesData = [];
      insertedDays.forEach((dayRow, index) => {
        const activities = uniqueDays[index].activities || [];
        const seenActs = new Set();
        const uniqueActs = activities.filter(act => {
          const key = `${act.time}-${JSON.stringify(act.activity_translations)}`;
          if (seenActs.has(key)) return false;
          seenActs.add(key);
          return true;
        });
        uniqueActs.forEach(act => {
          activitiesData.push({
            day_id: dayRow.id,
            time: act.time,
            activity_translations: act.activity_translations,
          });
        });
      });

      if (activitiesData.length > 0) {
        ensure(await supabase.from("day_activities").insert(activitiesData));
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ [PUT] Exception:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}



// ================== DELETE ==================
export async function DELETE(req, context) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const { id } = await context.params;

    const { data: days, error: daysFetchError } = await supabase
      .from("trip_days")
      .select("id")
      .eq("trip_id", id);
    if (daysFetchError) throw daysFetchError;

    const dayIds = days?.map((day) => day.id) || [];
    if (dayIds.length > 0) {
      const { error: activitiesError } = await supabase
        .from("day_activities")
        .delete()
        .in("day_id", dayIds);
      if (activitiesError) throw activitiesError;
    }

    await supabase.from("trip_cities").delete().eq("trip_id", id);
    await supabase.from("trip_categories").delete().eq("trip_id", id);
    await supabase.from("includes").delete().eq("trip_id", id);
    await supabase.from("trip_days").delete().eq("trip_id", id);

    // ✅ احذف الرحلة نفسها
    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) {
      console.error("❌ [DELETE] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Trip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [DELETE] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
