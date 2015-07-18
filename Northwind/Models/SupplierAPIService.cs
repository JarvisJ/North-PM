using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Northwind.Models
{
    public class SupplierAPIService
    {
        // get all suppliers
        public static IEnumerable<SupplierAPIData> GetAll()
        {
            NorthwindDbContext db = new NorthwindDbContext();
            
            return db.Suppliers
                .Select(x => new SupplierAPIData { 
                            SupplierID = x.SupplierID,
                            CompanyName = x.CompanyName,
                            City = x.City,
                            Country = x.Country})
                .ToList();
        }

        // get a supplier's products
        public static IEnumerable<ProductAPIData> GetSupplierProducts(int supplierID)
        {
            NorthwindDbContext db = new NorthwindDbContext();

            Supplier supplier = db.Suppliers
                .Where(x => x.SupplierID == supplierID)
                .FirstOrDefault();

            if (supplier != null)
            {
                // found supplier. return his products
                return supplier.Products
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

            return null;
        }
    }

    // the Supplier data transfer object
    public class SupplierAPIData 
    {
        public int SupplierID { get; set; }
        public string CompanyName { get; set; }

        public string City { get; set; }
        public string Country { get; set; }
    }
}