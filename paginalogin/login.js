// script.js

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");
  
    try {
      const response = await fetch("https://api.seuservidor.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Sucesso no login
        alert("Login bem-sucedido!");
        window.location.href = "/dashboard"; // Redireciona para a página inicial ou painel
      } else {
        // Exibe a mensagem de erro da API
        errorMessage.textContent = result.message || "Erro ao realizar o login.";
      }
    } catch (error) {
      errorMessage.textContent = "Erro ao conectar com o servidor.";
    }
  });
  