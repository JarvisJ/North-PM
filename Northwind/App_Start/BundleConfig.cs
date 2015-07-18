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

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));



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
