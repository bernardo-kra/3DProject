export const myRoutes = {
    routeBody: "http://localhost:3001",
    routeUser: "/user",
    routeLogin: "/login",
    routeRegister: "register",
    routeProtect: "/protect",
    routeCreateproject: "/create-project",
    routeProject: "/project",
    routeMyProject: "/my-project",
    routeAboutUs: "/about",
    routeContact: "/contact",


    routeProjectId: (id) => {
        return `/project/${id}`
    },
    routeMyProjectId: (id) => {
        return `/my-project/${id}`
    },
    routeUpdate: (id) => {
        return `/update/${id}`
    }
};

export default myRoutes;