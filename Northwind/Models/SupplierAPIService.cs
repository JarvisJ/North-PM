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
            using (var db = new NorthwindDbContext())
            {
                return db.Suppliers
                    .Select(x => new SupplierAPIData
                    {
                        SupplierID = x.SupplierID,
                        CompanyName = x.CompanyName,
                        City = x.City,
                        Country = x.Country
                    })
                    .ToList();
            }
        }

        // get a supplier's products
        public static IEnumerable<ProductAPIData> GetSupplierProducts(int supplierID)
        {

            using (var db = new NorthwindDbContext())
            {
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
                            UnitPrice = x.UnitPrice,
                            Discontinued = x.Discontinued
                        })
                        .ToList();
                }
            }

            return null;
        }

        public static SupplierAPIData AddSupplier(SupplierAPIData nSupplier, bool doCommit = true)
        {
            if (nSupplier.CompanyName.Length > 40)
            {
                throw new FormatException("CompanyName must be less than or equal to 40 characters.");
            }
            using (var db = new NorthwindDbContext())
            {
                Supplier supplier = db.Suppliers.Add(new Supplier
                {
                    CompanyName = nSupplier.CompanyName
                });

                if (doCommit)
                {
                    db.SaveChanges();
                }

                return new SupplierAPIData(supplier);
            }
        }

        public static SupplierAPIData UpdateSupplier(int supplierID, SupplierAPIData nSupplier, bool doCommit = true)
        {
            if (nSupplier.CompanyName.Length > 40)
            {
                throw new FormatException("CompanyName must be less than or equal to 40 characters.");
            }

            using (var db = new NorthwindDbContext())
            {
                Supplier supplier = db.Suppliers.Find(supplierID);

                // only update the company name
                supplier.CompanyName = nSupplier.CompanyName;

                if (doCommit)
                {
                    db.SaveChanges();
                }

                return new SupplierAPIData(supplier);
            }
        }

        public static void DeleteSupplier(int supplierID, bool doCommit = true)
        {
            using (var db = new NorthwindDbContext())
            {
                Supplier supplier = db.Suppliers.Find(supplierID);
                if (supplier == null)
                {
                    throw new KeyNotFoundException();
                }

                // need to delete the supplier's products before deleting the supplier.
                DeleteSupplierProducts(supplier, db, false);

                db.Suppliers.Remove(supplier);

                if (doCommit)
                {
                    db.SaveChanges();
                }
            }
        }

        public static void DeleteSupplierProducts(Supplier supplier, NorthwindDbContext db, bool doCommit = true)
        {
            ICollection<Product> products = supplier.Products;

            if (products != null || products.Count() > 0 )
            {
                DeleteProductsOrderDetails(products, db, false);
                db.Products.RemoveRange(products);
            }

            if (doCommit)
            {
                db.SaveChanges();
            }
        }

        public static void DeleteProductsOrderDetails(ICollection<Product> products, NorthwindDbContext db, bool doCommit = true)
        {
            IEnumerable<Order_Detail> details = products.SelectMany(x => x.Order_Details);

            if (details != null || details.Count() > 0)
            {
                db.Order_Details.RemoveRange(details);
            }

            if (doCommit)
            {
                db.SaveChanges();
            }
        }

        public static IEnumerable<SupplierMonthlySalesAPIData> GetSalesByMonth()
        {
            using (var db = new NorthwindDbContext())
            {
                var query = @"select s.SupplierID,s.CompanyName,s.CompanyName,month(o.OrderDate) OrderMonth, year(o.OrderDate) OrderYear,  isnull(Sum(CONVERT(money,(od.UnitPrice*od.Quantity*(1-od.Discount)/100))*100),0) MTDOrderDollars
                                    FROM Suppliers s inner join Products  p on s.SupplierID = p.SupplierID
				                                     inner join ""Order Details"" od on p.ProductID = od.ProductID
				                                     inner join Orders o on od.OrderID = o.OrderID
                                    Group By s.SupplierID,s.CompanyName, month(o.OrderDate),year(o.OrderDate) 
                                    order by OrderYear,OrderMonth";
                var monthlySales = db.Database.SqlQuery<SupplierMonthlySalesAPIData>(query).ToList();

                return monthlySales;
            }
        }
    }

    // the Supplier data transfer object
    public class SupplierAPIData 
    {
        public SupplierAPIData()
        {

        }
        public SupplierAPIData(Supplier supplier)
        {
            SupplierID = supplier.SupplierID;
            CompanyName = supplier.CompanyName;
            City = supplier.City;
            Country = supplier.Country;
        }
        public int SupplierID { get; set; }
        public string CompanyName { get; set; }

        public string City { get; set; }
        public string Country { get; set; }
    }

    // the Supplier Monthly Sales DTO
    public class SupplierMonthlySalesAPIData
    {
        public SupplierMonthlySalesAPIData()
        {

        }

        public int SupplierID { get; set; }
        public string CompanyName { get; set; }

        public int OrderMonth { get; set; }
        public int OrderYear { get; set; }
        public decimal MTDOrderDollars { get; set; }
    }
}