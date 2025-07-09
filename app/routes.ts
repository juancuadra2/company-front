import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),

   //Auth
    ...prefix("/auth", [
        layout("layouts/auth-layout.tsx", [
            route("login", "auth/login-page.tsx"),
        ])
    ]),

    //Companies - Rutas protegidas
    ...prefix("/companies", [
        layout("layouts/protected-layout.tsx", [
            layout("layouts/company-layout.tsx", [
                index("companies/companies-list.tsx"),
                route(":id/edit", "companies/company-edit.tsx"),
            ])
        ])
    ]),
] satisfies RouteConfig;
