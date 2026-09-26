import { supabase } from "@/lib/supabaseClient";
import { requireAdmin } from "@/lib/authGuard";

export async function POST(req) {
  try {
    const auth = await requireAdmin();
    if (auth.response) return auth.response;

    const body = await req.json();

    // ✅ إدخال الرحلة في جدول trips
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .insert({
        title: body.title,
        description: body.description,
        price: body.price,
        currency: body.currency,
        duration: body.duration,
        duration_unit: body.duration_unit,
        cover_image: body.cover_image,
        gallery_images: body.gallery_images,
        priceLevel: body.priceLevel,
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // ✅ إدخال الـ includes
    if (body.includes?.length > 0) {
      const includesData = body.includes.map((inc) => ({
        trip_id: trip.id,
        include_translations: {
          en: inc.en,
          es: inc.es,
          fr: inc.fr,
          de: inc.de,
          it: inc.it,
          zh: inc.zh,
        },
      }));
      const { error: includesError } = await supabase
        .from("includes")
        .insert(includesData);
      if (includesError) throw includesError;
    }

    // ✅ إدخال المدن (باستخدام IDs مباشرة)
    if (body.cities?.length > 0) {
      const citiesData = body.cities.map((cityId) => ({
        trip_id: trip.id,
        city_id: cityId,
      }));
      const { error: citiesError } = await supabase
        .from("trip_cities")
        .insert(citiesData);
      if (citiesError) throw citiesError;
    }

    // ✅ إدخال التصنيفات (باستخدام IDs مباشرة)
    if (body.categories?.length > 0) {
      const categoriesData = body.categories.map((catId) => ({
        trip_id: trip.id,
        category_id: catId,
      }));
      const { error: categoriesError } = await supabase
        .from("trip_categories")
        .insert(categoriesData);
      if (categoriesError) throw categoriesError;
    }

    // ✅ إدخال الأيام والأنشطة
    if (body.itinerary?.length > 0) {
      const daysData = body.itinerary.map((day, index) => ({
        trip_id: trip.id,
        day_number: day.day || index + 1,
      }));

      const { data: insertedDays, error: daysError } = await supabase
        .from("trip_days")
        .insert(daysData)
        .select();

      if (daysError) throw daysError;

      const activitiesData = [];
      insertedDays.forEach((dayRow, index) => {
        const activities = body.itinerary[index].activities || [];
        activities.forEach((act) => {
          activitiesData.push({
            day_id: dayRow.id,
            time: act.time,
            activity_translations: act.activity || {
              en: act.en || null,
              es: act.es || null,
              fr: act.fr || null,
              de: act.de || null,
              it: act.it || null,
              zh: act.zh || null,
            },
          });
        });
      });


      if (activitiesData.length > 0) {
        const { error: activitiesError } = await supabase
          .from("day_activities")
          .insert(activitiesData);
        if (activitiesError) throw activitiesError;
      }
    }

    return new Response(JSON.stringify({ success: true, trip }), {
      status: 201,
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { data: trips, error } = await supabase.from("trips").select(`
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
        city_id,
        cities ( id, name )
      ),
      trip_categories (
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
      ),
       reviews (
          id,
          user_id,
          trip_id,
          rating,
          comment,
          created_at
        )
    `);

    if (error) {
      console.error("Trips fetch error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ success: true, trips }), {
  status: 200,
  headers: { "Cache-Control": "public, max-age=3600" } // ساعة
});

  } catch (err) {
    console.error("GET /api/trips error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 },
    );
  }
}
