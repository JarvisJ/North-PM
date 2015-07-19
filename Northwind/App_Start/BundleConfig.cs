using System.Web;
using System.Web.Optimization;

namespace Northwind
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));



            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                      "~/Scripts/ng/angular.js",
                      "~/Scripts/ng/angular-resource.js"));

            bundles.Add(new ScriptBundle("~/bundles/northwind").Include(
                      "~/Scripts/ng/NorthwindControllers.js",
                      "~/Scripts/ng/NorthwindDirectives.js",
                      "~/Scripts/ng/NorthwindFilters.js",
                      "~/Scripts/ng/NorthwindServices.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/devoops-style.css"));
        }
    }
}
