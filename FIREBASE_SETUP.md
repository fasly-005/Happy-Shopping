# Happy Shopping Firebase setup

The Firebase web-app configuration is in `firebase-config.js`. It identifies the Firebase project; it is not an Admin SDK service-account key. Firebase Authentication, Firestore, and Storage must still be enabled in the console.

## Enable services

1. In Firebase Console, open project `happy-shopping-c5048`.
2. In Authentication, enable Email/Password and Google sign-in. Set the public site hostname under Authentication's authorized domains. For local testing, serve the site from `localhost`; opening it as a `file://` URL is not supported for Firebase sign-in.
3. Create the Firestore database and Storage bucket in the console.
4. Serve the site over HTTP(S).
5. Deploy `firestore.rules` and `storage.rules` from this project. Admin-only rules require both the server-granted `admin` custom claim and the configured administrator email.

## Grant admin access

The email `fmfasly@gmail.com` is the intended administrator account, but an email address in frontend code is not an authorization boundary. After the account has signed in to Firebase Authentication, a trusted, private Admin SDK environment must grant that account the `admin: true` custom claim. Never put a service-account key in this website or commit one to this repository. Sign out and sign back in after the claim is granted so Firebase refreshes the ID token.

## Data contracts

- Public catalog: documents in `products` with `published: true`, a non-empty `name`, and a numeric non-negative `price` in LKR. Optional fields are `category` (`apparel`, `home`, `beauty`, `electronics`, or `other`) and `imageUrl` (HTTP(S) URL).
- Customer profiles: `users/{uid}` stores the account's display name, email, and creation time. Customers can only access their own profile.
- Orders: `orders/{orderId}` is readable by its authenticated owner and admins. Client-side order creation is intentionally denied. Add a trusted Cloud Function or other server-side order endpoint to validate prices and stock, create orders, update inventory, grant tracking access, and notify admins.
- Product image uploads are limited to authenticated admins, image content types, and files smaller than 10 MB in `products/`.

The customer storefront and authentication read these Firebase services when hosted over HTTP(S). Secure order placement, admin editing, live tracking, and notifications are not active until their trusted server-side services are implemented and deployed.
