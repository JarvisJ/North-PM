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
            using (var db = new NorthwindDbContext())
            {
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
        }

        public static ProductAPIData AddProduct(ProductAPIData nProduct, bool doCommit = true)
        {
            if (nProduct.ProductName.Length > 40)
            {
                throw new FormatException("ProductName must be less than or equal to 40 characters.");
            }

            using (var db = new NorthwindDbContext())
            {
                Product product = db.Products.Add(new Product
                {
                    ProductName = nProduct.ProductName,
                    SupplierID = nProduct.SupplierID,
                    Discontinued = nProduct.Discontinued
                });

                if (doCommit)
                {
                    db.SaveChanges();
                }

                return new ProductAPIData
                    {
                        ProductID = product.ProductID,
                        ProductName = product.ProductName,
                        SupplierID = product.SupplierID
                    };
            }
        }


        // get a single product
        public static ProductAPIData GetProduct(int productID)
        {
            using (var db = new NorthwindDbContext())
            {
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