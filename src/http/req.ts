const base_url = 'http://192.168.1.176:3001';

const get_employees = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  fetch(`${base_url}/get_employee_info`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const get_product = (type: any, callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
    TYPE: type ? '122' : '44',
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/get_activation_product_type`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const send_activation = (data: any, callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/activate_product`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const get_products = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`${base_url}/get_products`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const getProductsByCompany = (args: any, callback: any) => {
  var myHeaders = new Headers();
  var raw = JSON.stringify({
    COMPANY_ID: args.COMPANY_ID,
  });
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'POST',
    body: raw,
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`${base_url}/get_products_by_company`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const getCompanyInfo = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  fetch(`${base_url}/company_info`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const gen_barcode = (data: any, callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
    PRODUCT_ID: data.PRODUCT_ID,
    QUANTITY: data.QUANTITY,
    NAME: "",
    PRODUCT_NAME: data.PRODUCT_NAME,
    MULTIPLIER: data.MULTIPLIER,
    EMPLOYEE_ID: data.EMPLOYEE_ID,
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/gen_barcode`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const submitShipment = (data: any, callback: any) => {

  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/shipment_insert`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));

}

const product_reduction = (data: any, callback: any) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/product_reduction`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));

}






class http_request {
  submit_shipment = (data: any, callback: any) => {
    submitShipment(data, (result: any) => {
      return callback(result);
    });
  }
  getEmployees = (callback: any) => {
    get_employees((result: any) => {
      return callback(result);
    });
  };
  getProduct = (type: any, callback: any) => {
    get_product(type, (result: any) => {
      return callback(result);
    });
  };
  getProducts = (callback: any) => {
    get_products((result: any) => {
      return callback(result);
    });
  };
  getProductsByCompany = (args: any, callback: any) => {
    getProductsByCompany(args, (result: any) => {
      return callback(result);
    });
  };
  getCompanyInfo = (callback: any) => {
    getCompanyInfo((result: any) => {
      return callback(result);
    });
  };
  sendActivation = (data: any, callback: any) => {
    send_activation(data, (result: any) => {
      return callback(result);
    });
  }
  genBarcode = (data: any, callback: any) => {
    gen_barcode(data, (result: any) => {
      return callback(result);
    });
  }
  productRelease = (data: any, callback: any) => {
    product_reduction(data, (result: any) => {
      return callback(result);
    });
  }
}

export const http_req = () => {
  return new http_request();
};
