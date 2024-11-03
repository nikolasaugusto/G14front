// script.js

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");
  
    try {
      const response = await fetch("http://localhost:5287/api/Usuarios/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email : email, senha : password})
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Sucesso no login
        localStorage.setItem("jwtToken", result.jwtToken);
        alert("Login bem-sucedido!");
        window.location.href = "/paginausuario/index.html"; // Redireciona para a página inicial ou painel
      } else {
        // Exibe a mensagem de erro da API
        errorMessage.textContent = result.message || "Erro ao realizar o login.";
      }
    } catch (error) {
      errorMessage.textContent = "Erro ao conectar com o servidor.";
    }
  });

  document.getElementById("showPassword").addEventListener("change", function() {
    const passwordField = document.getElementById("password");
    passwordField.type = this.checked ? "text" : "password";
});






  