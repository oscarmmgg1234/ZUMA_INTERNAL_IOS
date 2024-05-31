const base_url = 'http://192.168.1.176:3001';
//192.168.1.176

const getProductInventory = async (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
    cache: 'no-cache',
    body: JSON.stringify({Mobile: true}),
  };
  fetch(`${base_url}/getInventory`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const getProductNameFromTrans = async (data: any, callback: Function) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/getProductNameFromTrans`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const revertTransaction = async (data: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,

    body: raw,
    redirect: 'follow',
  };
  await fetch(`${base_url}/revertTransaction`, requestOptions);
};

const getTransaction = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };
  fetch(`${base_url}/getTransactionLog`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const getShipmentLog = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
    TYPE: '122',
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/getShipmentLog`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const get_activation_log = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
    TYPE: '122',
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/getActivationLog`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const get_reduction_log = (callback: any) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
    TYPE: '122',
  });
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/getReductionLog`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

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
    NAME: data.NAME,
    PRODUCT_NAME: data.PRODUCT_NAME,
    MULTIPLIER: data.MULTIPLIER,
    EMPLOYEE_ID: data.EMPLOYEE_ID,
    SRC: data.SRC,
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
};

const product_reduction = async (data: any) => {
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(
      `${base_url}/product_reduction`,
      requestOptions,
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const getBarcodeData = (data: any, callback: any) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };
  fetch(`${base_url}/get_barcode_data`, requestOptions)
    .then(response => response.json())
    .then(result => {
      return callback(result);
    })
    .catch(error => console.log('error', error));
};

const get_api_status = (callback: (status: boolean) => void) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };

  // Set a timeout duration (e.g., 5000 milliseconds)
  const timeoutDuration = 1000;

  // Create a promise that rejects after the timeout duration
  const timeout = new Promise<Response>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeoutDuration);
  });

  // Use Promise.race to race the fetch against the timeout
  Promise.race([fetch(`${base_url}/api_status`, requestOptions), timeout])
    .then(response => {
      if (response instanceof Response) {
        return response.json(); // Cast the response to the Response type
      } else {
        throw new Error('Invalid response type');
      }
    })
    .then(result => {
      // Assuming that a successful response contains a specific field or structure
      // You can modify the condition based on your API's successful response structure
      if (result && result.status) {
        callback(true);
      } else {
        callback(false);
      }
    })
    .catch(error => {
      console.log('error', error);
      callback(false);
    });
};

class http_request {
  getProductInventory = (callback: any) => {
    getProductInventory((result: any) => {
      return callback(result);
    });
  };
  getProductNameFromTrans = async (data: any, callback: Function) => {
    getProductNameFromTrans(data, (result: any) => {
      return callback(result);
    });
  };
  revertTransaction = (data: any) => {
    revertTransaction(data);
  };
  getTransactions = (callback: any) => {
    getTransaction((result: any) => {
      return callback(result);
    });
  };
  getShipmentLog = (callback: any) => {
    getShipmentLog((result: any) => {
      return callback(result);
    });
  };
  getActivationLog = (callback: any) => {
    get_activation_log((result: any) => {
      return callback(result);
    });
  };
  getReductionLog = (callback: any) => {
    get_reduction_log((result: any) => {
      return callback(result);
    });
  };
  get_api_status = (callback: (status: boolean) => void) => {
    get_api_status((status: boolean) => {
      return callback(status);
    });
  };
  submit_shipment = (data: any, callback: any) => {
    submitShipment(data, (result: any) => {
      return callback(result);
    });
  };
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
  };
  genBarcode = (data: any, callback: any) => {
    gen_barcode(data, (result: any) => {
      return callback(result);
    });
  };
  productRelease = async (data: any) => {
    return await product_reduction(data);
  };
  getBarcodeData = (data: any, callback: any) => {
    getBarcodeData(data, (result: any) => {
      return callback(result);
    });
  };
}

export const http_req = () => {
  return new http_request();
};
