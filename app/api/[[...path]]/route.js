import { NextResponse } from "next/server";
import { GET as usersGET } from "../../../lib/api-handlers/users/route";
import { POST as updateRolePOST } from "../../../lib/api-handlers/updateRole/route";
import { GET as messagesGET, POST as messagesPOST, PUT as messagesPUT } from "../../../lib/api-handlers/messages/route";
import { GET as typingGET, POST as typingPOST } from "../../../lib/api-handlers/typing/route";
import { POST as contactPOST } from "../../../lib/api-handlers/contact/route";
import { GET as purchasesGET } from "../../../lib/api-handlers/purchases/route";
import { GET as reviewsGET, POST as reviewsPOST } from "../../../lib/api-handlers/reviews/route";
import { GET as reviewGET, PUT as reviewPUT, DELETE as reviewDELETE } from "../../../lib/api-handlers/reviews/[id]/route";
import { GET as reviewLikesGET, POST as reviewLikesPOST, DELETE as reviewLikesDELETE } from "../../../lib/api-handlers/reviews/[id]/like/route";
import { POST as purchasePOST } from "../../../lib/api-handlers/purchase/route";
import { GET as citiesGET } from "../../../lib/api-handlers/cities/route";
import { GET as categoriesGET } from "../../../lib/api-handlers/categories/route";
import { POST as cancelPOST } from "../../../lib/api-handlers/cancel/route";
import { GET as tripsGET, POST as tripsPOST } from "../../../lib/api-handlers/trips/route";
import { GET as tripGET, PUT as tripPUT, DELETE as tripDELETE } from "../../../lib/api-handlers/trips/[id]/route";
import { POST as checkoutPOST } from "../../../lib/api-handlers/checkout/route";
import { POST as authRegisterPOST } from "../../../lib/api-handlers/auth/register/route";
import { GET as authMeGET } from "../../../lib/api-handlers/auth/me/route";
import { POST as authLogoutPOST } from "../../../lib/api-handlers/auth/logout/route";
import { POST as authLoginPOST } from "../../../lib/api-handlers/auth/login/route";
import { GET as googleCallbackGET } from "../../../lib/api-handlers/auth/callback/google/route";

const notFound = () => NextResponse.json({ success: false, error: "API route not found" }, { status: 404 });
const methodNotAllowed = () => NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });

async function dispatch(req, context) {
  const { path = [] } = await context.params;
  const segments = Array.isArray(path) ? path : [path];
  const [resource, id, action] = segments;
  const method = req.method;
  const dynamicContext = (value) => ({ params: Promise.resolve({ id: value }) });

  if (resource === "auth") {
    if (id === "callback" && action === "google") return method === "GET" ? googleCallbackGET(req) : methodNotAllowed();
    if (id === "register") return method === "POST" ? authRegisterPOST(req) : methodNotAllowed();
    if (id === "me") return method === "GET" ? authMeGET(req) : methodNotAllowed();
    if (id === "logout") return method === "POST" ? authLogoutPOST(req) : methodNotAllowed();
    if (id === "login") return method === "POST" ? authLoginPOST(req) : methodNotAllowed();
    return notFound();
  }

  if (resource === "users" && segments.length === 1) return method === "GET" ? usersGET(req) : methodNotAllowed();
  if (resource === "updateRole" && segments.length === 1) return method === "POST" ? updateRolePOST(req) : methodNotAllowed();
  if (resource === "messages" && segments.length === 1) return method === "GET" ? messagesGET(req) : method === "POST" ? messagesPOST(req) : method === "PUT" ? messagesPUT(req) : methodNotAllowed();
  if (resource === "typing" && segments.length === 1) return method === "GET" ? typingGET(req) : method === "POST" ? typingPOST(req) : methodNotAllowed();
  if (resource === "contact" && segments.length === 1) return method === "POST" ? contactPOST(req) : methodNotAllowed();
  if (resource === "purchases" && segments.length === 1) return method === "GET" ? purchasesGET(req) : methodNotAllowed();
  if (resource === "purchase" && segments.length === 1) return method === "POST" ? purchasePOST(req) : methodNotAllowed();
  if (resource === "cities" && segments.length === 1) return method === "GET" ? citiesGET(req) : methodNotAllowed();
  if (resource === "categories" && segments.length === 1) return method === "GET" ? categoriesGET(req) : methodNotAllowed();
  if (resource === "cancel" && segments.length === 1) return method === "POST" ? cancelPOST(req) : methodNotAllowed();
  if (resource === "checkout" && segments.length === 1) return method === "POST" ? checkoutPOST(req) : methodNotAllowed();

  if (resource === "trips") {
    if (segments.length === 1) return method === "GET" ? tripsGET(req) : method === "POST" ? tripsPOST(req) : methodNotAllowed();
    if (segments.length === 2 && id) return method === "GET" ? tripGET(req, dynamicContext(id)) : method === "PUT" ? tripPUT(req, dynamicContext(id)) : method === "DELETE" ? tripDELETE(req, dynamicContext(id)) : methodNotAllowed();
  }

  if (resource === "reviews") {
    if (segments.length === 1) return method === "GET" ? reviewsGET(req) : method === "POST" ? reviewsPOST(req) : methodNotAllowed();
    if (segments.length === 3 && action === "like") return method === "GET" ? reviewLikesGET(req, dynamicContext(id)) : method === "POST" ? reviewLikesPOST(req) : method === "DELETE" ? reviewLikesDELETE(req) : methodNotAllowed();
    if (segments.length === 2 && id) return method === "GET" ? reviewGET(req, dynamicContext(id)) : method === "PUT" ? reviewPUT(req, dynamicContext(id)) : method === "DELETE" ? reviewDELETE(req, dynamicContext(id)) : methodNotAllowed();
  }

  return notFound();
}

export const GET = dispatch;
export const POST = dispatch;
export const PUT = dispatch;
export const DELETE = dispatch;