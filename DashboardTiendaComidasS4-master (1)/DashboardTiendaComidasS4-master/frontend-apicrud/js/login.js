//varibales globales del formulario de login
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin");

//evento al boton del formulario
btnLogin.addEventListener("click", () => {
  /* alert("escribió: " + userInput.value); */
  let dataForm = getData();
  sendData(dataForm);
});

//funcion para validar el formulario
//obtener datos del formulario
let getData = () => {
  //validar formulario
  let user;
  if (userInput.value && passInput.value) {
    user = {
      usuario: userInput.value,
      contrasena: passInput.value,
    };
    userInput.value = "";
    passInput.value = "";
  } else {
    alert("El usuario y la contraseña son obligatorios");
  }
  console.log(user);
  return user;
};

//funcion para recibir los datos y
// realizar la petición al servidor
let sendData = async (data) => {
  let url = "http://localhost/backend-apiCrud/login";
  try {
    let respuesta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    //verificar la respuesta del servidor
    if (respuesta.status === 401) {
      alert("Usuario o contraseña son incorrectos");
    } else {
      let userLogin = await respuesta.json();
      alert(`Bienvenido ${userLogin.nombre}`);
      //guardar datos en LocalStorage
      localStorage.setItem("userLogin", JSON.stringify(userLogin));
      location.href = "../index.html"; //redireccionar a index
    }
  } catch (error) {
    console.log(error);
  }
};
