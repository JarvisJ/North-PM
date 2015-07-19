using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Northwind.Models;

namespace Northwind.Controllers
{
    public class ProductsController : ApiController
    {
        // GET: api/Products
        public IEnumerable<ProductAPIData> GetProducts()
        {
            return ProductsAPIService.GetAll();
        }

        // GET: api/Products/5
        [ResponseType(typeof(ProductAPIData))]
        public IHttpActionResult GetProduct(int id)
        {
            ProductAPIData product = ProductsAPIService.GetProduct(id);

            return Ok(product);
        }


        // POST api/<controller>
        [HttpPost]
        [Route("api/product")]
        public ProductAPIData Post([FromBody]ProductAPIData value)
        {
            return ProductsAPIService.AddProduct(value);
        }


    }
}