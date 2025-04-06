import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/": {};
  "/admin/baskets": {};
  "/admin/products": {};
  "/admin/products/new": {};
  "/admin/products/:id": {
    "id": string;
  };
};