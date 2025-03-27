# Woolworths APIs

There are no official APIs to retrieve data from Woolworths, but their websites make use of an HTTP API.

The APIs provide much more information than we need. We should only parse what is necessary.

Here are examples of retrieved data from them:

## New Zealand

### Search for products

fetch("https://www.woolworths.co.nz/api/v1/products?target=search&search=weetbix&inStockProductsOnly=false&size=48", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-dtpc": "2$30437930_362h14vVKJGETCTAANFKUUUNWAHVCITDMNOQNTK-0e0",
    "x-requested-with": "OnlineShopping.WebApp",
    "x-ui-ver": "7.61.26",
    "cookie": "...",
    "Referer": "https://www.woolworths.co.nz/shop/searchproducts?search=weetbix",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

#### Sample Response

{
  "products": {
    "items": [
      {
        "type": "Product",
        "name": "sanitarium weet-bix cereal ",
        "barcode": "9414942805653",
        "variety": null,
        "brand": "sanitarium weet-bix",
        "slug": "sanitarium-weet-bix-cereal",
        "sku": "885704",
        "unit": "Each",
        "selectedPurchasingUnit": null,
        "price": {
          "originalPrice": 8.79,
          "salePrice": 7.5,
          "savePrice": 1.29,
          "savePercentage": 0.0,
          "canShowSavings": true,
          "hasBonusPoints": false,
          "isClubPrice": false,
          "isSpecial": true,
          "isNew": false,
          "canShowOriginalPrice": true,
          "discount": null,
          "total": null,
          "isTargetedOffer": false,
          "averagePricePerSingleUnit": null,
          "isBoostOffer": false,
          "purchasingUnitPrice": null,
          "orderedPrice": null,
          "isUsingOrderedPrice": false,
          "currentPricingMatchesOrderedPricing": null,
          "extendedListPrice": null,
          "originalAveragePricePerSingleUnit": null
        },
        "images": {
          "small": "https://assets.woolworths.com.au/images/2010/885704.jpg?impolicy=wowcdxwbjbx&w=65&h=65",
          "big": "https://assets.woolworths.com.au/images/2010/885704.jpg?impolicy=wowcdxwbjbx&w=200&h=200"
        },
        "quantity": {
          "min": 1.0,
          "max": 100.0,
          "increment": 1.0,
          "value": null,
          "quantityInOrder": null,
          "purchasingQuantityString": null
        },
        "stockLevel": 3,
        "eachUnitQuantity": null,
        "averageWeightPerUnit": null,
        "size": {
          "cupListPrice": 0.73,
          "cupPrice": 0.63,
          "cupMeasure": "100g",
          "packageType": null,
          "volumeSize": "1.2kg"
        },
        "hasShopperNotes": null,
        "productTag": {
          "tagType": "IsSpecial",
          "multiBuy": null,
          "bonusPoints": null,
          "additionalTag": null,
          "targetedOffer": null,
          "boostOffer": null
        },
        "departments": [
          {
            "id": 7,
            "name": "Pantry"
          }
        ],
        "subsAllowed": false,
        "supportsBothEachAndKgPricing": false,
        "adId": null,
        "brandSuggestionId": null,
        "brandSuggestionName": null,
        "priceUnitLabel": null,
        "availabilityStatus": "In Stock",
        "onlineSample": null,
        "onlineSampleRealProductMapId": 0
      },
      {
        "type": "Product",
        "name": "sanitarium weet-bix cereal ",
        "barcode": "9414942010750",
        "variety": "",
        "brand": "sanitarium weet-bix",
        "slug": "sanitarium-weet-bix-cereal",
        "sku": "33022",
        "unit": "Each",
        "selectedPurchasingUnit": null,
        "price": {
          "originalPrice": 6.49,
          "salePrice": 6.49,
          "savePrice": 0.00,
          "savePercentage": 0.0,
          "canShowSavings": true,
          "hasBonusPoints": false,
          "isClubPrice": false,
          "isSpecial": false,
          "isNew": false,
          "canShowOriginalPrice": true,
          "discount": null,
          "total": null,
          "isTargetedOffer": false,
          "averagePricePerSingleUnit": null,
          "isBoostOffer": false,
          "purchasingUnitPrice": null,
          "orderedPrice": null,
          "isUsingOrderedPrice": false,
          "currentPricingMatchesOrderedPricing": null,
          "extendedListPrice": null,
          "originalAveragePricePerSingleUnit": null
        },
        "images": {
          "small": "https://assets.woolworths.com.au/images/2010/33022.jpg?impolicy=wowcdxwbjbx&w=65&h=65",
          "big": "https://assets.woolworths.com.au/images/2010/33022.jpg?impolicy=wowcdxwbjbx&w=200&h=200"
        },
        "quantity": {
          "min": 1.0,
          "max": 100.0,
          "increment": 1.0,
          "value": null,
          "quantityInOrder": null,
          "purchasingQuantityString": null
        },
        "stockLevel": 3,
        "eachUnitQuantity": null,
        "averageWeightPerUnit": null,
        "size": {
          "cupListPrice": 0.87,
          "cupPrice": 0.87,
          "cupMeasure": "100g",
          "packageType": "",
          "volumeSize": "750g"
        },
        "hasShopperNotes": null,
        "productTag": null,
        "departments": [
          {
            "id": 7,
            "name": "Pantry"
          }
        ],
        "subsAllowed": false,
        "supportsBothEachAndKgPricing": false,
        "adId": null,
        "brandSuggestionId": null,
        "brandSuggestionName": null,
        "priceUnitLabel": null,
        "availabilityStatus": "In Stock",
        "onlineSample": null,
        "onlineSampleRealProductMapId": 0
      }
    ],
    "totalItems": 2
  }
}

### Retrieve product details

fetch("https://www.woolworths.co.nz/api/v1/products/885704", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "no-cache",
    "content-type": "application/json",
    "expires": "Sat, 01 Jan 2000 00:00:00 GMT",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-dtpc": "2$30675848_437h12vVKJGETCTAANFKUUUNWAHVCITDMNOQNTK-0e0",
    "x-requested-with": "OnlineShopping.WebApp",
    "x-ui-ver": "7.61.26",
    "cookie": "...",
    "Referer": "https://www.woolworths.co.nz/shop/productdetails?stockcode=885704&name=sanitarium-weet-bix-cereal",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

#### Sample Response

{
  "sku": "885704",
  "name": "sanitarium weet-bix cereal ",
  "brand": "sanitarium weet-bix",
  "genericName": "cereal",
  "variety": null,
  "bigImageUrl": "9414942805653.jpg",
  "smallImageUrl": "9414942805653.jpg",
  "breadcrumb": {
    "department": {
      "key": "Department",
      "value": 7,
      "isBooleanValue": false,
      "name": "Pantry",
      "productCount": 0,
      "shelfResponses": null,
      "group": null
    },
    "aisle": {
      "key": "Aisle",
      "value": 63,
      "isBooleanValue": false,
      "name": "Cereals & Spreads",
      "productCount": 0,
      "shelfResponses": null,
      "group": null
    },
    "shelf": {
      "key": "Shelf",
      "value": 326,
      "isBooleanValue": false,
      "name": "Cereal",
      "productCount": 0,
      "shelfResponses": null,
      "group": null
    },
    "productGroup": null,
    "dynamicGroup": null
  },
  "images": [
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_1.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_1.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_2.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_2.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_3.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_3.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_4.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_4.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_5.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_5.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    },
    {
      "big": "https://assets.woolworths.com.au/images/2010/885704_6.jpg?impolicy=wowcdxwbjbx&w=900&h=900",
      "small": "https://assets.woolworths.com.au/images/2010/885704_6.jpg?impolicy=wowcdxwbjbx&w=500&h=500"
    }
  ],
  "unit": "Each",
  "quantity": {
    "min": 1.0,
    "max": 100.0,
    "increment": 1.0,
    "value": 0.0,
    "quantityInOrder": null,
    "purchasingQuantityString": null
  },
  "productStoresStockLevel": null,
  "price": {
    "originalPrice": 8.79,
    "salePrice": 7.5,
    "savePrice": 1.29,
    "savePercentage": 0.0,
  },
  "size": {
    "cupListPrice": 0.0,
    "cupPrice": 0.63,
    "cupMeasure": "100g",
    "packageType": null,
    "volumeSize": "1.2kg"
  },
  "alcohol": 0.0,
  "healthStarRating": 10,
  "origins": [
    "New Zealand made"
  ],
  "description": "<p>Weet-bix™ is packed full of 97% wholegrain goodness, and provides you with a good source of iron and vitamins b1, b2 and b3 to help release the energy you need to kickstart your day, as part of a balanced diet. Providing a natural source of fibre, weet-bix is also low in fat and sugar and contains 5 essential vitamins and minerals.</p>",
  "shopperNotes": "",
  "allergens": [
    "Contains Cereals Containing Gluten, May contain Lupin"
  ],
  "claims": [
    "1.2kg = big family pack, 97% whole grain, Boosted with: sunflower seeds; strawberries (fresh or frozen); banana, Grain booster for study day, Iron & B vitamins, Iron to support everyday learning by helping brain activity and function. Thiamin for brain function. As part of a balanced diet., Kiwi kids are Weet-Bix kids™, Low sugar, New Zealand made, NZ's no.1 breakfast cereal, So the star thing on the front (go on, have a look), that's a Health Star Rating. It's a government led initiative, rating foods from a 1/2 star up to 5 stars, based on their nutritional value. This Weet-Bix™ you're holding has 6 stars! So what are you waiting for? Stop reading and start eating!, Source of fibre, Weet-Bix™ wheat biscuits have been a classic wholegrain staple in the pantry for years. One 33g serve of Weet-Bix™ wheat biscuits contributes over 60% towards the Grains & Legumes Nutrition Council™ 48g Wholegrain Daily Target Intake. So start your day with Weet-Bix™ and you will be well on your way to reaching the target!"
  ],
  "endorsements": [],
  "ingredients": {
    "ingredients": [
      "Wholegrain Wheat (97%), Sugar, Salt, Barley Malt Extract, Vitamins (Niacin, Thiamin, Riboflavin, Folate), Mineral (Iron)"
    ],
    "footnotes": null
  },
  "averageWeightPerUnit": 0.0,
  "supportsBothEachAndKgPricing": false,
  "selectedPurchasingUnit": null,
  "availabilityStatus": "In Stock",
  "isSuccessful": true,
  "messages": null,
  "changeOrderCheck": null
}

## Australia

Unfortunately, Australia's API seems to require a valid cookie.

### Search for products

First, fetch www.woolworths.com.au and get _abck cookie.

fetch("https://www.woolworths.com.au/apis/ui/Search/products", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json",
    "priority": "u=1, i",
    "request-id": "|c73791e4353d4d79b5483a5e22a09668.6e1fcd23570b44e1",
    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-c73791e4353d4d79b5483a5e22a09668-6e1fcd23570b44e1-01",
    "x-dtpc": "1$32736742_72h17vCQROFADKURMQSEMHEPLUKBOBPNKFMCVU-0e0, 1$32736742_72h17vCQROFADKURMQSEMHEPLUKBOBPNKFMCVU-0e0",
    "cookie": "_fbp=fb.2.1735719704573.769188248703455767; AAMC_wfg_0=REGION%7C8; __qca=P0-52123564-1735719704827; _gcl_au=1.1.1921589904.1735719705; _ga_Y81FR5TFDY=GS1.1.1735719705.1.0.1735719715.50.0.0; AKA_A2=A; bff_region=syd2; akaalb_woolworths.com.au=~op=www_woolworths_com_au_ZoneA:PROD-ZoneA|www_woolworths_com_au_BFF_SYD_Launch:WOW-BFF-SYD2|~rv=19~m=PROD-ZoneA:0|WOW-BFF-SYD2:0|~os=43eb3391333cc20efbd7f812851447e6~id=2239882be82675fefd8cbb3ef5602268; rxVisitor=17430307433263OM5TAGICGH0K4T1522HK34U8QDB4315; dtSa=-; ai_user=YQi3uZUdtdtlX7VzAulF6o|2025-03-26T23:12:23.347Z; at_check=true; INGRESSCOOKIE=1743030744.443.198.788638|37206e05370eb151ee9f1b6a1c80a538; AMCVS_4353388057AC8D357F000101%40AdobeOrg=1; AMCV_4353388057AC8D357F000101%40AdobeOrg=179643557%7CMCIDTS%7C20174%7CMCMID%7C47639510052288841500368708600410800083%7CMCAAMLH-1743635543%7C8%7CMCAAMB-1743635543%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1743037943s%7CNONE%7CvVersion%7C5.5.0; ak_bmsc=49E8DB5FD4F51C9021E107BF4D301359~000000000000000000000000000000~YAAQybQuFz/3ZsWVAQAANnS61BvblDil9OrQqSoYAcBUxi1qJUEdNKVQGg1RY1TBM07ocixtIqrwfVDQcJOyar/ckzp+9OCiqIMzt0cI64z98AeXkcTGDe9wbQ4AOrQwR/6e6xrO9iWcNYCU9Phdka7EiYmW1S0cBRVg54d8uMWETS90EebTnnsr9BsOFCdfo9dHdESltH+gVHX/irk4D2lTgd72cTftRooJ0GM1KHGY/AqHIzuQbgZczcFA9pq7JRzFEXmA8QvkUdKbAp/SA8sPbqhQHR470KhDmfmzfNm6ZDNkeFMaSi/CTCC3GJbt62G6qXid7fcY/AvhZ6mB/CrdKIfrv4FPpdohRdhhO66R3kxbdLKgWD6haDf5Tf4aH8dKr6PFPnAbAni5eWbwtHSVcQWWP45VGBh4Nzvwu2/Hm8ShVmjHJKA7e7M+1+gHCECykxoxGMsbIHYpM0z88V2+MQ==; fullstoryEnabled=false; s_cc=true; aam_uuid=48085851140049657380412809549190977039; IR_gbd=woolworths.com.au; _tt_enable_cookie=1; _ttp=01JQABN0HX8SRRXSV27QSSFX9Y_.tt.2; dtCookie=v_4_srv_1_sn_UB5LAHQ8JMEOL4UT4K670N9EKNS7H6NQ_app-3Af908d76079915f06_1_ol_0_perc_100000_mul_1; kampyle_userid=1e62-e7b3-dd39-2c1e-1084-0a18-f382-2219; _scid=bOrjZVvXkRWOi3YRzYSV1GD_r-I8z2dT; _gid=GA1.3.2132724196.1743030748; _ScCbts=%5B%22541%3Bchrome.2%3A2%3A5%22%5D; __gads=ID=8438ce8bcee6b981:T=1743030749:RT=1743030749:S=ALNI_MZU5ZGD8CTMLR_qhVW6UiDlYYeUxw; __gpi=UID=00001001b87ccdf5:T=1743030749:RT=1743030749:S=ALNI_MZe26d6b5iUdz6PMmAigbJ1omUNlg; __eoi=ID=9187e94e77566e91:T=1743030749:RT=1743030749:S=AA-AfjaHukgV3UlLBBpycTk2_zlw; _sctr=1%7C1742994000000; _uetsid=c8fec0000a9711f0a0776bcc276f1258; _uetvid=c8feb3400a9711f0a63431fbaa5a4335; IR_7464=1743030853047%7C0%7C1743030853047%7C%7C; _scid_r=ZmrjZVvXkRWOi3YRzYSV1GD_r-I8z2dTiHyiFA; kampyleUserSession=1743030853108; kampyleUserSessionsCount=3; kampyleUserPercentile=21.581002558105933; _ga=GA1.3.1305590914.1735719705; w-rctx=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzI2NTAsImV4cCI6MTc0MzAzNjI1MCwiaWF0IjoxNzQzMDMyNjUwLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.ZL_0QUdv7YLE6IozJm33ri9vmy1RMTVFHnRdo7tjg4nHdDGmSFoXnFuZkQpRHcayzyeBu3IxbyhTv83o4CixKfvrhhNW-Mlhs_FVEYQuriSXlgWNhW8TKsgzGLyryqhwFbxx6GB3VJQK93vWQ1MAySLa0LdACpQ2NDJefQ2WGTGMt3G0QN986bi-k70ORjcWnjuOCbA4_b2Vh8RpobC_4QLKdFUQj4UVA2BzX2iusEVhbM48sK5JRI3kCuP3iyEbbDIsW1bCRyUzYks-Yh10RN0PFVDJyBO2JLPT7iquj3jcQY8l7YQ88jJjLzQ0Fppxi5vujwoJpIzQEGOp09wedw; wow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzI2NTAsImV4cCI6MTc0MzAzNjI1MCwiaWF0IjoxNzQzMDMyNjUwLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.ZL_0QUdv7YLE6IozJm33ri9vmy1RMTVFHnRdo7tjg4nHdDGmSFoXnFuZkQpRHcayzyeBu3IxbyhTv83o4CixKfvrhhNW-Mlhs_FVEYQuriSXlgWNhW8TKsgzGLyryqhwFbxx6GB3VJQK93vWQ1MAySLa0LdACpQ2NDJefQ2WGTGMt3G0QN986bi-k70ORjcWnjuOCbA4_b2Vh8RpobC_4QLKdFUQj4UVA2BzX2iusEVhbM48sK5JRI3kCuP3iyEbbDIsW1bCRyUzYks-Yh10RN0PFVDJyBO2JLPT7iquj3jcQY8l7YQ88jJjLzQ0Fppxi5vujwoJpIzQEGOp09wedw; prodwow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzI2NTAsImV4cCI6MTc0MzAzNjI1MCwiaWF0IjoxNzQzMDMyNjUwLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.ZL_0QUdv7YLE6IozJm33ri9vmy1RMTVFHnRdo7tjg4nHdDGmSFoXnFuZkQpRHcayzyeBu3IxbyhTv83o4CixKfvrhhNW-Mlhs_FVEYQuriSXlgWNhW8TKsgzGLyryqhwFbxx6GB3VJQK93vWQ1MAySLa0LdACpQ2NDJefQ2WGTGMt3G0QN986bi-k70ORjcWnjuOCbA4_b2Vh8RpobC_4QLKdFUQj4UVA2BzX2iusEVhbM48sK5JRI3kCuP3iyEbbDIsW1bCRyUzYks-Yh10RN0PFVDJyBO2JLPT7iquj3jcQY8l7YQ88jJjLzQ0Fppxi5vujwoJpIzQEGOp09wedw; mbox=PC#cc9fb121f78349d5b20f79db1923b358.36_0#1806275654|session#a6c38417956d4fc1bf4d4042fce307fe#1743034597; _ga_YBVRJYN9JL=GS1.1.1743032736.2.0.1743032736.60.0.0; _gat_gtag_UA_38610140_9=1; kampyleSessionPageCounter=2; bm_sz=7D02038E76AA67EA9972E8D84BBA04D0~YAAQPUDbFw3mL62VAQAAytvY1Btay6/ly8p6f+MnrBJ4wFecx68tKAdmWYw0jYRh39kEF9AUq4Nz6RX6I+IInruXPbCxJ68yUJxO88GrF88I7Tx4gomg4n4/oZZ6xiOWwMy0ENI/7SWKeOdGTxAZ8gifM5Mnxim6494rGWzCDRhlvOlDBY+BqTF9dRbGz6BO5IBme2+TtOHuSklazAQwQddNkjalXxpbws3uJ4PK9MXhbpL+BWqITaUJIJ/Ss50m6nKEkK2WZjugpzS0RIfXSA/csDShNfeAjCriimjDuBKn38zrgMDWby2XX1RQPXjVjMXBQ+GN9/cQ4uPLBgoWAMVEeFkSGHUqQv+m9vjsHsGiqvI5+SaYwHOqUkKLf+GgFYpgpJ4Ij/z9B6kt67AQQZuzE4jRSLiCeulS97LgXTJziPFZJylzUlNOu3OnzcmQWZzLOXJczPekXSDdEOoQ1mV8lA==~3622456~3490360; utag_main=v_id:019420f4d424000cd8582c36cb7e05075002406d00b3b$_sn:3$_ss:1$_st:1743034536590$vapi_domain:woolworths.com.au$_se:1$dc_visit:2$ses_id:1743032736590%3Bexp-session$_pn:1%3Bexp-session$dc_event:1%3Bexp-session; RT=\"z=1&dm=www.woolworths.com.au&si=b91790db-7d15-4dc8-a593-2efe3df424dd&ss=m8qji0jx&sl=3&tt=16v&obo=2&rl=1\"; _abck=4D5CE8915AD047C4C9A3924A2C04B6BB~0~YAAQPUDbFz7mL62VAQAAlt3Y1A0RA8AVF7x1JUOzz6tTODnipOckK1ej1qVxMpH0+Bbpv19FGylI3UDyaYboaN80dYOTb2Ohdzuqndz34XFletiWeOPpT0y2MyFpcoGw4toaCRjUjbMugDRNrcn2su5zw4HiyxTDI80YL9X5GmXXfDQOKCc8baXcYyaP+HppGhkXetcI4tTAG8hL/uHIm9r6m2zAGXxn2OJIEjNhfufNTx9/V6HwOo66ykqJLEsEVDH3EWe559Tu7m3oQyWI7UWn7Tr4X+8SqO9hesiTGIu/VboaBrN4TNvq7jhvdVlqBN4cTG5E6l9IQBny+xV+kXAPNzcT6OUESDOYwEagCMJq2FMBtzJN2IaTNjucT4Xh5s2A4FhctZyIiBqM5wOJuEGCyIPRviSeKn6FAb/JbiCxUONJm89L79WnC3C3QJriRrtC4k+sQVaczLgsCJFB72P6NITv1BhESkHqFOiO0/UDRsgnWpGWwFuTmT3umtLR+WFX0h0/MCQhH0uZGNC62JQrtHrmj0sG4U5AIrKwtt+RGtXsFc5iL9Bw7MBWcR/mo+bvwMpw4npTVUzI0kSo9pr5Za1KkOghyoEGrWl4usuipZ/tzOyPVyqXgfITDnkh1sv3mlArv/nMGDnVgNyiufDC0jWCu3Fn1Mi4rA/34egtAundiCF64+TUiU/RJSLz3Hc+Kv5tcRzcZFm3TjRldmBxyxu4yk9PmB3bEnFTZkoCZNB49Qk=~-1~-1~1743034343; bm_sv=EE57C43A4CB149FDC630362A260330CA~YAAQPUDbF1PmL62VAQAAzt7Y1BtkvW2ucU581avYobx/pUIqb4gzON94K0o2gUWbv9V2RaBzSlLe5GybQVM35Ka2KVHl1rRAPms1NRlB+VvUGfC74THgXEudme7NEwIL9+0ik5sV7gewNgAyUszovKH7HFnaHkOW3MXystuQqSSG/4UvJFxUZu7zDvkQB4ZuYwN1CvtuR1gWEmzJ/nupjIPjDw4ShNyBv2Kkd7UpV065LxPAM4wucP/PZ2vlSxDdg21dr738F1s=~1; ai_session=tPnwd4Ro+BmPrap2O4NJZU|1743032736692|1743032737476; rxvt=1743034537482|1743032736744; dtPC=1$32736742_72h17vCQROFADKURMQSEMHEPLUKBOBPNKFMCVU-0e0",
    "Referer": "https://www.woolworths.com.au/shop/search/products?searchTerm=weetbix",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "{\"Filters\":[],\"IsSpecial\":false,\"Location\":\"/shop/search/products?searchTerm=weetbix\",\"PageNumber\":1,\"PageSize\":24,\"SearchTerm\":\"weetbix\",\"SortType\":\"TraderRelevance\",\"IsRegisteredRewardCardPromotion\":null,\"ExcludeSearchTypes\":[\"UntraceableVendors\"],\"GpBoost\":0,\"GroupEdmVariants\":true,\"EnableAdReRanking\":false,\"flags\":{\"EnableProductBoostExperiment\":false}}",
  "method": "POST"
});

#### Sample Response

{
  "Products": [
    {
      "Products": [
        {
          "TileID": 1,
          "Stockcode": 200695,
          "Barcode": "9300652010794",
          "GtinFormat": 13,
          "CupPrice": 0.5,
          "InstoreCupPrice": 0.5,
          "CupMeasure": "100G",
          "CupString": "$0.50 / 100G",
          "InstoreCupString": "$0.50 / 100G",
          "HasCupPrice": true,
          "InstoreHasCupPrice": true,
          "Price": 6,
          "InstorePrice": 6,
          "Name": "Weet - Bix Breakfast Cereal",
          "DisplayName": "Weet - Bix Breakfast Cereal 1.2kg",
          "UrlFriendlyName": "weet-bix-breakfast-cereal",
          "Description": " Weet - Bix Breakfast Cereal 1.2Kg",
          "SmallImageFile": "https://cdn0.woolworths.media/content/wowproductimages/small/200695.jpg",
          "MediumImageFile": "https://cdn0.woolworths.media/content/wowproductimages/medium/200695.jpg",
          "LargeImageFile": "https://cdn0.woolworths.media/content/wowproductimages/large/200695.jpg",
          "WasPrice": 6,
          "Unit": "Each",
          "MinimumQuantity": 1,
          "PackageSize": "1.2Kg",
          "UnitWeightInGrams": 0,
          "SmallFormatDescription": "Weet - Bix Breakfast Cereal",
          "FullDescription": "Weet - Bix Breakfast Cereal",
          "IsAvailable": true,
          "IsPurchasable": true,
          "DisplayQuantity": 1,
          "SapCategories": null,
          "Brand": "Weet - Bix",
          "AdditionalAttributes": {
          },
          "DetailsImagePaths": [
            "https://cdn0.woolworths.media/content/wowproductimages/large/200695.jpg"
          ],
          "Variety": "Cereal",
          "Rating": {
          },
          "Tags": [],
        }
      ],
      "Name": "Weet - Bix Breakfast Cereal",
      "DisplayName": "Weet - Bix Breakfast Cereal 1.2kg"
    },
    {
      "Products": [
        {
          "TileID": 2,
          "Stockcode": 33021,
          "Barcode": "9300652010374",
          "GtinFormat": 13,
          "CupPrice": 0.93,
          "InstoreCupPrice": 0.93,
          "CupMeasure": "100G",
          "CupString": "$0.93 / 100G",
          "InstoreCupString": "$0.93 / 100G",
          "HasCupPrice": true,
          "InstoreHasCupPrice": true,
          "Price": 3.5,
          "InstorePrice": 3.5,
          "Name": "Weet - Bix Breakfast Cereal",
          "DisplayName": "Weet - Bix Breakfast Cereal 375g",
          "UrlFriendlyName": "weet-bix-breakfast-cereal",
          "Description": " Weet - Bix Breakfast Cereal 375G",
          "SmallImageFile": "https://cdn0.woolworths.media/content/wowproductimages/small/033021.jpg",
          "MediumImageFile": "https://cdn0.woolworths.media/content/wowproductimages/medium/033021.jpg",
          "LargeImageFile": "https://cdn0.woolworths.media/content/wowproductimages/large/033021.jpg",
          "IsNew": false,
          "IsHalfPrice": false,
          "IsOnlineOnly": false,
          "IsOnSpecial": false,
          "InstoreIsOnSpecial": false,
          "IsEdrSpecial": false,
          "SavingsAmount": 0.0,
          "InstoreSavingsAmount": 0.0,
          "WasPrice": 3.5,
          "InstoreWasPrice": 3.5,
          "QuantityInTrolley": 0,
          "Unit": "Each",
          "MinimumQuantity": 1,
          "HasBeenBoughtBefore": false,
          "IsInTrolley": false,
          "Source": "SearchServiceSearchProducts",
          "SupplyLimit": 36,
          "ProductLimit": 36,
          "MaxSupplyLimitMessage": "36 item limit",
          "IsInStock": true,
          "PackageSize": "375G",
          "UnitWeightInGrams": 0,
          "SupplyLimitMessage": "'Weet - Bix Breakfast Cereal' has a supply limit of 36. The quantity in your cart has been reduced accordingly. To purchase a larger quantity, please contact us on 1800 000 610. Please note we do not supply trade orders.",
          "SmallFormatDescription": "Weet - Bix Breakfast Cereal",
          "FullDescription": "Weet - Bix Breakfast Cereal",
          "IsAvailable": true,
          "IsPurchasable": true,
          "Brand": "Weet - Bix",
          "AdditionalAttributes": {
          },
          "DetailsImagePaths": [
            "https://cdn0.woolworths.media/content/wowproductimages/large/033021.jpg"
          ],
          "Variety": "Cereal",
          "Rating": {
          },
          "SupplyLimitSource": "ProductLimit",
          "Tags": []
        }
      ],
      "Name": "Weet - Bix Breakfast Cereal",
      "DisplayName": "Weet - Bix Breakfast Cereal 375g"
    }
  ],
  "SearchResultsCount": 2,
  "VisualShoppingAisleResponse": [],
}

### Retrieve product details

fetch("https://www.woolworths.com.au/api/v3/ui/schemaorg/product/200695", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "priority": "u=1, i",
    "request-id": "|b4ddb6dfdd5f49acb766a58014a12f64.e4e2a29ff0eb4298",
    "sec-ch-ua": "\"Chromium\";v=\"134\", \"Not:A-Brand\";v=\"24\", \"Google Chrome\";v=\"134\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "traceparent": "00-b4ddb6dfdd5f49acb766a58014a12f64-e4e2a29ff0eb4298-01",
    "cookie": "_fbp=fb.2.1735719704573.769188248703455767; AAMC_wfg_0=REGION%7C8; __qca=P0-52123564-1735719704827; _gcl_au=1.1.1921589904.1735719705; _ga_Y81FR5TFDY=GS1.1.1735719705.1.0.1735719715.50.0.0; AKA_A2=A; bff_region=syd2; akaalb_woolworths.com.au=~op=www_woolworths_com_au_ZoneA:PROD-ZoneA|www_woolworths_com_au_BFF_SYD_Launch:WOW-BFF-SYD2|~rv=19~m=PROD-ZoneA:0|WOW-BFF-SYD2:0|~os=43eb3391333cc20efbd7f812851447e6~id=2239882be82675fefd8cbb3ef5602268; rxVisitor=17430307433263OM5TAGICGH0K4T1522HK34U8QDB4315; dtSa=-; ai_user=YQi3uZUdtdtlX7VzAulF6o|2025-03-26T23:12:23.347Z; at_check=true; INGRESSCOOKIE=1743030744.443.198.788638|37206e05370eb151ee9f1b6a1c80a538; w-rctx=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzA3NDMsImV4cCI6MTc0MzAzNDM0MywiaWF0IjoxNzQzMDMwNzQzLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.I3bi1EC1NJxdMrDvIrRQtfQihbqK_-MRgYQwK8GggLaU_7JdYErfTjmyvKncp30wXJTzwk_n4hRws-V0APO1XZR6CX7gvOBQ191Kh3eWjdVeal1siRaSgCT1gFvoTA94tRHQfrU5XcGJkAigIc6mru-pYlZbNYMqORYXlDtjaMhXevUZi8NgnOYGBhmKYSC9CmRdWkmGBFRXUJx0geNMFMxZ_Wpo0SM6nXpn39b95KC7xcMFeshrX7mPIPfvw4F95SMX960mz8C_OaMq9bDn_My6KSFQnQZG2qq8E6lg6xDRog92FAXfRRCH_L42UtOMqrkN1w_S23xLUCSx2BAv3A; wow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzA3NDMsImV4cCI6MTc0MzAzNDM0MywiaWF0IjoxNzQzMDMwNzQzLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.I3bi1EC1NJxdMrDvIrRQtfQihbqK_-MRgYQwK8GggLaU_7JdYErfTjmyvKncp30wXJTzwk_n4hRws-V0APO1XZR6CX7gvOBQ191Kh3eWjdVeal1siRaSgCT1gFvoTA94tRHQfrU5XcGJkAigIc6mru-pYlZbNYMqORYXlDtjaMhXevUZi8NgnOYGBhmKYSC9CmRdWkmGBFRXUJx0geNMFMxZ_Wpo0SM6nXpn39b95KC7xcMFeshrX7mPIPfvw4F95SMX960mz8C_OaMq9bDn_My6KSFQnQZG2qq8E6lg6xDRog92FAXfRRCH_L42UtOMqrkN1w_S23xLUCSx2BAv3A; prodwow-auth-token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYmYiOjE3NDMwMzA3NDMsImV4cCI6MTc0MzAzNDM0MywiaWF0IjoxNzQzMDMwNzQzLCJpc3MiOiJXb29sd29ydGhzIiwiYXVkIjoid3d3Lndvb2x3b3J0aHMuY29tLmF1Iiwic2lkIjoiMCIsInVpZCI6IjQwZDEzOTQ4LWQ2OWYtNDNkNC1hMjllLWQxOTY5NzM1NTgwNiIsIm1haWQiOiIwIiwiYXV0IjoiU2hvcHBlciIsImF1YiI6IjAiLCJhdWJhIjoiMCIsIm1mYSI6IjEifQ.I3bi1EC1NJxdMrDvIrRQtfQihbqK_-MRgYQwK8GggLaU_7JdYErfTjmyvKncp30wXJTzwk_n4hRws-V0APO1XZR6CX7gvOBQ191Kh3eWjdVeal1siRaSgCT1gFvoTA94tRHQfrU5XcGJkAigIc6mru-pYlZbNYMqORYXlDtjaMhXevUZi8NgnOYGBhmKYSC9CmRdWkmGBFRXUJx0geNMFMxZ_Wpo0SM6nXpn39b95KC7xcMFeshrX7mPIPfvw4F95SMX960mz8C_OaMq9bDn_My6KSFQnQZG2qq8E6lg6xDRog92FAXfRRCH_L42UtOMqrkN1w_S23xLUCSx2BAv3A; AMCVS_4353388057AC8D357F000101%40AdobeOrg=1; AMCV_4353388057AC8D357F000101%40AdobeOrg=179643557%7CMCIDTS%7C20174%7CMCMID%7C47639510052288841500368708600410800083%7CMCAAMLH-1743635543%7C8%7CMCAAMB-1743635543%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1743037943s%7CNONE%7CvVersion%7C5.5.0; ak_bmsc=49E8DB5FD4F51C9021E107BF4D301359~000000000000000000000000000000~YAAQybQuFz/3ZsWVAQAANnS61BvblDil9OrQqSoYAcBUxi1qJUEdNKVQGg1RY1TBM07ocixtIqrwfVDQcJOyar/ckzp+9OCiqIMzt0cI64z98AeXkcTGDe9wbQ4AOrQwR/6e6xrO9iWcNYCU9Phdka7EiYmW1S0cBRVg54d8uMWETS90EebTnnsr9BsOFCdfo9dHdESltH+gVHX/irk4D2lTgd72cTftRooJ0GM1KHGY/AqHIzuQbgZczcFA9pq7JRzFEXmA8QvkUdKbAp/SA8sPbqhQHR470KhDmfmzfNm6ZDNkeFMaSi/CTCC3GJbt62G6qXid7fcY/AvhZ6mB/CrdKIfrv4FPpdohRdhhO66R3kxbdLKgWD6haDf5Tf4aH8dKr6PFPnAbAni5eWbwtHSVcQWWP45VGBh4Nzvwu2/Hm8ShVmjHJKA7e7M+1+gHCECykxoxGMsbIHYpM0z88V2+MQ==; fullstoryEnabled=false; s_cc=true; aam_uuid=48085851140049657380412809549190977039; IR_gbd=woolworths.com.au; _tt_enable_cookie=1; _ttp=01JQABN0HX8SRRXSV27QSSFX9Y_.tt.2; dtCookie=v_4_srv_1_sn_UB5LAHQ8JMEOL4UT4K670N9EKNS7H6NQ_app-3Af908d76079915f06_1_ol_0_perc_100000_mul_1; kampyle_userid=1e62-e7b3-dd39-2c1e-1084-0a18-f382-2219; _scid=bOrjZVvXkRWOi3YRzYSV1GD_r-I8z2dT; _gid=GA1.3.2132724196.1743030748; _ScCbts=%5B%22541%3Bchrome.2%3A2%3A5%22%5D; __gads=ID=8438ce8bcee6b981:T=1743030749:RT=1743030749:S=ALNI_MZU5ZGD8CTMLR_qhVW6UiDlYYeUxw; __gpi=UID=00001001b87ccdf5:T=1743030749:RT=1743030749:S=ALNI_MZe26d6b5iUdz6PMmAigbJ1omUNlg; __eoi=ID=9187e94e77566e91:T=1743030749:RT=1743030749:S=AA-AfjaHukgV3UlLBBpycTk2_zlw; _sctr=1%7C1742994000000; IR_7464=1743030752743%7C0%7C1743030752743%7C%7C; _scid_r=ZWrjZVvXkRWOi3YRzYSV1GD_r-I8z2dTiHyiEw; _ga=GA1.3.1305590914.1735719705; kampyleUserSession=1743030752966; kampyleUserSessionsCount=2; kampyleUserPercentile=17.222516789861466; rxvt=1743032553320|1743030743327; dtPC=1$30751259_637h-vAAHVKGTBRGILJHPWEUACKCFFJUMKQFOH-0e0; _gat_gtag_UA_38610140_9=1; kampyleSessionPageCounter=2; utag_main=v_id:019420f4d424000cd8582c36cb7e05075002406d00b3b$_sn:2$_ss:0$_st:1743032639553$vapi_domain:woolworths.com.au$_se:9$ses_id:1743030747157%3Bexp-session$_pn:2%3Bexp-session$dc_visit:1$dc_event:5%3Bexp-session$dc_region:ap-southeast-2%3Bexp-session$dleUpToDate:true%3Bexp-session; _abck=4D5CE8915AD047C4C9A3924A2C04B6BB~-1~YAAQybQuF5r8Z8WVAQAAJOm71A01VElkSalJzVLcgAySmx2trvNEwj/nlIS5GwnTWDGtYcbDfMLgGfVeNiDBNAgZTrU1VTOFrmfJ7HorwMXYGqkKUjovGy/IW60OL+8HzOTIAtFDjMQkB/5FtYI4z24fC0HUAW9CQM+7Ce9vJ1G2AJHB3kRwgFZ8+tvakYugXsSwPzUz1j7fwYYcuzJ3DlS9qBHjVDI/5JEkLoWo4k/PLVBPhvn3SXCXtMBjODnwtvJIyiKiNyChHzF58y5zm808nnBcHvZ7qW5HTsMCpCW3ic9Ju5cWw8n5EK0ZkLuQJ8itwhqqUUkMnx+/4WkE88GuSrscxcHLtI/h5kGR89zkYQ+YX0tMC2uiQ5AHcWIh4hq2UB2n+xTHHxDLauTxVyyafIpvxxV/g9BLcFOOCPQL7XDb3H2yLxBmnoskj2FB+zkXqZZKGMjnOGHoeKsPVO8HBH8WhQD6pa+Sg/RkZ+9bbl27vwgahpAOp0QDUrMm9VPMOpaa4jvXwYc8d1zfv4pORpAQ6jZT4xBlGbgdXki4FtAAWxSg5lPZhB37J2sU+SmaunY3pNj/sOuY8o7gCw/Y6woyGbUqOHQOdWZrI8eJUaScwp/vBgWZezZ+Cu7V63KfIbYWs4kGR7T35K2bQ8aGZeO2sgXom5SrHs4GXQwsVDpgQGStJpNBRkMBfkTJiN25rcD9oJJX8+7jG6Ar~0~-1~1743034343; _uetsid=c8fec0000a9711f0a0776bcc276f1258; _uetvid=c8feb3400a9711f0a63431fbaa5a4335; bm_sz=7D02038E76AA67EA9972E8D84BBA04D0~YAAQybQuF40eaMWVAQAAwg+81Bv05I8vxOkK54r2llwNnqU5Q2pYdtzOONqDxWbEpeEfeCd/d+hB3RjvQ2IfENk/3+U7o7ruovepZRFs0bBz/jhE5SkTbpacHF/uUkaxU4BiXl0ii1RhGhhwNhp77rzVzhRsGqjf98oBNJw3a9uzJLgQyqbPrV1mmLjhTjabdRCoNUkXo9VaYqNBM6yhokHli4VfC9VXj46mktYzOJAFLlFr66+9unKav0go6M/e2CJsphGuqljOnYFsFbeuISpyS3AgepQd5lRd+BNY6CXIS67qRrJITlUv3nzQ3bwpcOqwI2Y1uPYMTAHmUGGYk4NAxufQgSvA03KWXpMQrvI68G6fucEJMch5VuK3JrJdC3WuQ1iJ9qr6pAvcXUxRYo5H1XUzD+jw+U5CfnBPlDcJmO/TPn8Udk0QKO5qsEZL~3622456~3490360; _ga_YBVRJYN9JL=GS1.1.1743030747.1.1.1743030849.49.0.0; mbox=PC#cc9fb121f78349d5b20f79db1923b358.36_0#1806275640|session#6aa0f4ad9b1047f8b93c3bb6dd47f9c2#1743032710; ai_session=inNbe1SQBnUoYivwh9Jxkr|1743030743510|1743030849568; RT=\"z=1&dm=www.woolworths.com.au&si=b91790db-7d15-4dc8-a593-2efe3df424dd&ss=m8qji0jx&sl=2&tt=16v&obo=1&rl=1\"; bm_sv=EE57C43A4CB149FDC630362A260330CA~YAAQybQuF1sfaMWVAQAA0RC81BszI/x+EmV/zKj4WGYxIw/4D1Lo3ebggVI2sJkkuC2Q4d4vDJsorDmodZJEFRfQkmhV76HaYbMraojawYjiGSbY2y7iOlrfU42oHdsxcnUbrA1fEhHuj3sFJZZdVr/mQSgFTCn9TBLQaGdOnTG1N08JdzP+KL3pD3A3hLoLtf9kAs2JZhNyoZEloaX1k8OxDXr0h+8E90VPOILUrN+Q7VK4X0nf54ZrihqzJp/BVBzAbRgkXFI=~1",
    "Referer": "https://www.woolworths.com.au/shop/productdetails/200695/weet-bix-breakfast-cereal",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
});

#### Sample Response

{
    "@context": "http://schema.org",
    "@type": "Product",
    "@id": null,
    "name": "Weet - Bix Breakfast Cereal 1.2Kg",
    "description": "Sanitarium Weet-Bix Breakfast Cereal Value contains 97% whole grain, low sugar and saturated fat, high fibre, and is a good source of iron and B-vitamins. Aussie owned and made.<br><br>You’ll find them in households all over the country each and every day. They’ve been loved by generations of Aussies and Weet-Bix™ is still Australia’s No.1 breakfast cereal.<br><br>Weet-Bix™ is packed full of 97% wholegrain goodness, and provides you with a good source of iron to help fight tiredness and fatigue, Vitamins B1, B2 and 3 to help release the energy you need to kickstart your day, as part of a balanced diet. Providing a natural source of high fibre, Weet-Bix™ is also low in fat and sugar and contains 5 essential vitamins and minerals.<br><br>97% wholegrain<br><br>Low Sugar<br><br>High Fibre<br><br>Aussie Owned & Made<br><br>High in Iron<br><br>High in Vitamins B1, B2 & B3",
    "additionalType": null,
    "alternateName": null,
    "disambiguatingDescription": null,
    "identifier": null,
    "image": "https://cdn0.woolworths.media/content/wowproductimages/large/200695.jpg",
    "mainEntityOfPage": null,
    "potentialAction": null,
    "sameAs": null,
    "url": null,
    "additionalProperty": null,
    "aggregateRating": { ... },
    "audience": null,
    "award": null,
    "brand": {
        "@context": "http://schema.org",
        "@type": "Organization",
        "@id": null,
        "name": "Weet - Bix",
        "description": null,
        "additionalType": null,
        "alternateName": null,
        "disambiguatingDescription": null,
        "identifier": null,
        "image": null,
        "mainEntityOfPage": null,
        "potentialAction": null,
        "sameAs": null,
        "url": null,
        "actionableFeedbackPolicy": null,
        "address": null,
        "aggregateRating": null,
        "alumni": null,
        "areaServed": null,
        "award": null,
        "brand": null,
        "contactPoint": null,
        "correctionsPolicy": null,
        "department": null,
        "dissolutionDate": null,
        "diversityPolicy": null,
        "duns": null,
        "email": null,
        "employee": null,
        "ethicsPolicy": null,
        "event": null,
        "faxNumber": null,
        "founder": null,
        "foundingDate": null,
        "foundingLocation": null,
        "funder": null,
        "globalLocationNumber": null,
        "hasOfferCatalog": null,
        "hasPOS": null,
        "isicV4": null,
        "legalName": null,
        "leiCode": null,
        "location": null,
        "logo": null,
        "makesOffer": null,
        "member": null,
        "memberOf": null,
        "naics": null,
        "numberOfEmployees": null,
        "owns": null,
        "parentOrganization": null,
        "publishingPrinciples": null,
        "review": null,
        "seeks": null,
        "sponsor": null,
        "subOrganization": null,
        "taxID": null,
        "telephone": null,
        "unnamedSourcesPolicy": null,
        "vatID": null
    },
    "category": null,
    "color": null,
    "depth": null,
    "gtin12": null,
    "gtin13": "9300652010794",
    "gtin14": null,
    "gtin8": null,
    "height": null,
    "isAccessoryOrSparePartFor": null,
    "isConsumableFor": null,
    "isRelatedTo": null,
    "isSimilarTo": null,
    "itemCondition": null,
    "logo": null,
    "manufacturer": null,
    "material": null,
    "model": null,
    "mpn": null,
    "offers": {
        "@context": "http://schema.org",
        "@type": "Offer",
        "@id": null,
        "name": null,
        "description": null,
        "additionalType": null,
        "alternateName": null,
        "disambiguatingDescription": null,
        "identifier": null,
        "image": null,
        "mainEntityOfPage": null,
        "potentialAction": {...},
        "sameAs": null,
        "url": null,
        "acceptedPaymentMethod": null,
        "addOn": null,
        "advanceBookingRequirement": null,
        "aggregateRating": null,
        "areaServed": null,
        "availability": "http://schema.org/InStock",
        "availabilityEnds": null,
        "availabilityStarts": null,
        "availableAtOrFrom": null,
        "availableDeliveryMethod": null,
        "businessFunction": null,
        "category": null,
        "deliveryLeadTime": null,
        "eligibleCustomerType": null,
        "eligibleDuration": null,
        "eligibleQuantity": null,
        "eligibleRegion": null,
        "eligibleTransactionVolume": null,
        "gtin12": null,
        "gtin13": null,
        "gtin14": null,
        "gtin8": null,
        "includesObject": null,
        "ineligibleRegion": null,
        "inventoryLevel": null,
        "itemCondition": "http://schema.org/NewCondition",
        "itemOffered": null,
        "mpn": null,
        "offeredBy": null,
        "price": 6.0,
        "priceCurrency": "AUD",
        "priceSpecification": null,
        "priceValidUntil": null,
        "review": null,
        "seller": null,
        "serialNumber": null,
        "sku": null,
        "validFrom": null,
        "validThrough": null,
        "warranty": null
    },
    "productID": null,
    "productionDate": null,
    "purchaseDate": null,
    "releaseDate": null,
    "review": [...],
    "sku": "200695",
    "weight": null,
    "width": null
}