# Shree Café — Motihari website

A responsive, static website for Shree Café, Motihari. It uses a forest-green / warm-cream visual system and includes a real business-listing photograph, responsive navigation, a menu section, item selection, a multi-item order form, direct WhatsApp ordering, table reservation enquiries, Google Maps directions, a photo lightbox and local SEO metadata.

## Run locally

No build step is required.

1. Extract `shree-cafe-website.zip`.
2. Open `index.html` in a modern browser, or serve the folder with a local server (recommended):
   - VS Code: use the Live Server extension; or
   - Python: run `python -m http.server 8000` inside this folder and open `http://localhost:8000`.

## Verified business configuration

- Name: Shree Café
- Address: Ground Floor, SBI Building, near Pipal Chowk, State Bank of India, Raghunathpur, Motihari, Bihar 845401, India
- Phone: +91 86039 42561
- WhatsApp: +91 86039 42561 (`918603942561` international format)
- Map coordinates: `26.6405454, 84.8957378`
- Google-listed hours: daily, 11:00 AM–9:30 PM

## Menu and order flow

The matching public business listing and customer feedback identify:

- Coffee — specifically praised in customer feedback.
- Burger — specifically mentioned as a must-try in customer feedback.
- Other listing categories / offerings: quick bites, small plates, breakfast and dessert.

The public listing does **not** provide a verified, item-by-item menu or current prices. Therefore this site does not invent dish names, varieties or prices. The menu shows Coffee and Burger as customer-mentioned favourites, with the other publicly listed menu categories as quick-add order requests. Customers can also type any other menu item they know into the order form and set its quantity.

Every order goes to the Shree Café WhatsApp number configured in `script.js`. The order form supports:

- Customer name and mobile number
- Dine-in at the café or takeaway pickup at the café
- Multiple item names and quantities
- Special instructions
- WhatsApp message containing all order details

**No home-delivery option is provided.** Orders are for service at Shree Café or customer pickup from the café. No guessed menu prices or totals are sent; the café confirms availability and current price on WhatsApp. The customer must press **Send** in WhatsApp. This website cannot send messages silently or confirm an order.

Table reservation is also a WhatsApp enquiry; the café must confirm availability before it is considered booked.

## Photos

The generic Unsplash images from the earlier draft have been removed. The hero and gallery use the one photograph currently exposed by the matching Shree Café Motihari public listing:

- Listing / photo source: https://www.top-rated.online/cities/Motihari/place/p/17054800/Shree%2BCaf%C3%A9
- Image asset: `https://cdn.top-rated.online/places/ChIJf0h4qb01kzkRkj1Lt1APIIQ/0e8c60ad599f61ef13527e4ae465f29210390a1c9f602737c39fc9de826666b4.webp`

The image is loaded directly from the public listing host. For best long-term control and image rights, replace it with an original photo supplied by the café owner. No photos from other businesses named Shree Café are used. Food-card illustrations are symbols, not photographs of Shree Café food.

To add original images later, place them in `images/` and replace the image URLs in `index.html`.

## Before going live

- Confirm the current menu, individual dish names, variants, prices and availability with the owner.
- Confirm opening hours before launch.
- Confirm that the public phone number is registered with WhatsApp.
- Replace the listing-hosted photo with owner-supplied original photos if possible.
- Test order messages from Android and iPhone devices.
- Publish on a hosting service and connect the final domain.

## Files

- `index.html` — website sections, metadata, map and business schema
- `styles.css` — responsive design and visual system
- `script.js` — cart/order builder, WhatsApp message generation, reservation enquiry and interactions
- `images/favicon.svg` — temporary favicon
