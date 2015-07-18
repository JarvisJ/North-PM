using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Northwind.Models
{
    public class ProductsAPIService
    {
        // get all products in the Northwind db
        public static IEnumerable<ProductAPIData> GetAll()
        {
            NorthwindDbContext db = new NorthwindDbContext();

            return db.Products
                .Select(x => new ProductAPIData
                    {
                        ProductID = x.ProductID,
                        ProductName = x.ProductName,
                        SupplierID = x.SupplierID,
                        UnitPrice = x.SupplierID,
                        Discontinued = x.Discontinued
                    })
                .ToList();
        }

        // get a single product
        public static ProductAPIData GetProduct(int productID)
        {
            NorthwindDbContext db = new NorthwindDbContext();

            return db.Products
                .Where(x => x.ProductID == productID)
                .Select(x => new ProductAPIData
                    {
                        ProductID = x.ProductID,
                        ProductName = x.ProductName,
                        SupplierID = x.SupplierID,
                        UnitPrice = x.UnitPrice,
                        Discontinued = x.Discontinued
                    })
                .FirstOrDefault();
        }

    }

    // the Product data transfer object
    public class ProductAPIData 
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public Nullable<int> SupplierID { get; set; }
        public Nullable<decimal> UnitPrice { get; set; }
        public bool Discontinued { get; set; }
    }
}