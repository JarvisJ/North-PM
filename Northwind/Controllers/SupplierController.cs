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
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}