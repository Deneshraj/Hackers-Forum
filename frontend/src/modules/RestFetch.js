import { getCookie } from '../components/common/Cookies';
class RestFetch {
    get(url) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('GET', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send();
        } catch(err) {
          reject(err);
        }
      })
    }

    get_data(url, data) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('GET', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send(data);
        } catch(err) {
          reject(err);
        }
      })
    }
  
    post(url, data) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('POST', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send(data);
        } catch(err) {
          reject(err);
        }
      })
    }
  
    put(url, data) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('PUT', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send(data);
        } catch(err) {
          reject(err);
        }
      })
    }
  
    patch(url, data) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('PATCH', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send(data);
        } catch(err) {
          reject(err);
        }
      })
    }
  
    delete(url, data) {
      return new Promise((resolve, reject) => {
        try {
          let xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function() {
            if(this.readyState == 4) {
              let response = JSON.parse(this.responseText);
              if(this.status == 201 || this.status == 200) resolve(response);
              else reject(this.response)
            }
          }
  
          xhr.open('DELETE', url, true);
          xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
          xhr.send(data);
        } catch(err) {
          reject(err);
        }
      })
    }
}

const rf = new RestFetch()
export default rf;