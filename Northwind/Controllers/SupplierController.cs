using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using Northwind.Models;

namespace Northwind.Controllers
{
    public class SupplierController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<SupplierAPIData> Get()
        {
            return SupplierAPIService.GetAll();
        }

        [HttpGet]
        [Route("api/supplier/{supplierID}/products")]
        public IEnumerable<ProductAPIData> GetSupplierProducts(int supplierID)
        {
            return SupplierAPIService.GetSupplierProducts(supplierID);
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public SupplierAPIData Post([FromBody]SupplierAPIData value)
        {
            return SupplierAPIService.AddSupplier(value);
        }

        // PUT api/<controller>/5
        public SupplierAPIData Put(int id, [FromBody]SupplierAPIData value)
        {
            return SupplierAPIService.UpdateSupplier(id,value);
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
            SupplierAPIService.DeleteSupplier(id);
        }


        [HttpGet]
        [Route("api/supplier/sales")]
        public IEnumerable<SupplierMonthlySalesAPIData> Sales()
        {
            return SupplierAPIService.GetSalesByMonth();
        }
    }
}