<script>
  import axios from 'axios';
  
  let email = '';
  let password = '';
  let name = '';
  let message = '';
  let loading = false;
  let isLogin = true;
  
  const API_URL = 'http://localhost:3000/api';
  
  async function handleSubmit() {
    loading = true;
    message = '';
    
    console.log('🚀 Enviando petición a:', `${API_URL}${isLogin ? '/auth/login' : '/auth/register'}`);
    console.log('📧 Datos:', { email, password, name: name || email.split('@')[0] });
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const data = isLogin 
        ? { email, password }
        : { email, password, name: name || email.split('@')[0] };
      
      const response = await axios.post(`${API_URL}${endpoint}`, data, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ Respuesta exitosa:', response.data);
      message = `✅ ${isLogin ? 'Login' : 'Registro'} exitoso!`;
      
      if (isLogin && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('🔑 Token guardado:', response.data.token);
      }
      
    } catch (error) {
      console.log('❌ Error completo:', error);
      console.log('❌ Error response:', error.response);
      console.log('❌ Error message:', error.message);
      console.log('❌ Error status:', error.response?.status);
      console.log('❌ Error data:', error.response?.data);
      
      let errorMsg = 'Error desconocido';
      if (error.code === 'ECONNREFUSED') {
        errorMsg = '❌ No se puede conectar con el servidor';
      } else if (error.code === 'ETIMEDOUT') {
        errorMsg = '❌ Timeout de conexión';
      } else if (error.response?.status === 404) {
        errorMsg = '❌ Endpoint no encontrado';
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      message = errorMsg;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-4">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if !isLogin}
      <input 
        type="text" 
        bind:value={name}
        placeholder="Nombre (opcional)"
        class="w-full p-2 border rounded"
      />
    {/if}
    
    <input 
      type="email" 
      bind:value={email}
      placeholder="Email"
      class="w-full p-2 border rounded"
      required
    />
    
    <input 
      type="password" 
      bind:value={password}
      placeholder="Contraseña"
      class="w-full p-2 border rounded"
      required
    />
    
    <button 
      type="submit"
      disabled={loading}
      class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
    >
      {loading ? 'Cargando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
    </button>
  </form>
  
  {#if message}
    <p class="mt-4 text-center {message.includes('❌') ? 'text-red-600' : 'text-green-600'}">{message}</p>
  {/if}
  
  <div class="mt-4 text-center">
    <button
      on:click={() => isLogin = !isLogin}
      class="text-blue-500 hover:underline"
    >
      {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
    </button>
  </div>
</div>