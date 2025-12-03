<script>
  import axios from 'axios';
  
  let amount = 1000;
  let provider = 'stripe';
  let description = 'Suscripción mensual';
  let loading = false;
  let message = '';
  
  const API_URL = 'http://localhost:3002/api';
  
  async function createPayment() {
    loading = true;
    message = '';
    
    // 🔍 VERIFICAR TOKEN
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', token);
    console.log('📧 Datos del pago:', { amount, provider, description });
    
    if (!token) {
      message = '❌ No hay token - debes iniciar sesión';
      loading = false;
      return;
    }
    
    try {
      console.log('🚀 Enviando a:', `${API_URL}/payments/create`);
      console.log('📋 Headers:', { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      });
      
      const response = await axios.post(
        `${API_URL}/payments/create`,
        {
          amount: parseInt(amount),
          currency: 'ARS',
          provider,
          description
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Respuesta pago:', response.data);
      message = '✅ Pago creado exitosamente';
      
    } catch (error) {
      console.log('❌ Error completo:', error);
      console.log('❌ Status:', error.response?.status);
      console.log('❌ Data:', error.response?.data);
      
      let errorMsg = 'Error desconocido';
      if (error.response?.status === 401) {
        errorMsg = '❌ No autorizado - token inválido o expirado';
      } else if (error.response?.status === 403) {
        errorMsg = '❌ Prohibido - sin permisos';
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }
      
      message = errorMsg;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
  <h2 class="text-2xl font-bold mb-4">Crear Pago</h2>
  
  {#if message}
    <p class="mb-4 text-center {message.includes('❌') ? 'text-red-600' : 'text-green-600'}">{message}</p>
  {/if}
  
  <form on:submit|preventDefault={createPayment} class="space-y-4">
    <div>
      <label for="amount" class="block text-sm font-medium mb-2">Monto (ARS)</label>
      <input
        id="amount"
        type="number"
        bind:value={amount}
        min="1"
        class="w-full p-2 border rounded"
        required
      />
    </div>
    
    <div>
      <label for="provider" class="block text-sm font-medium mb-2">Pasarela de Pago</label>
      <select id="provider" bind:value={provider} class="w-full p-2 border rounded">
        <option value="stripe">Stripe</option>
        <option value="mercadopago">Mercado Pago</option>
        <option value="todopago">Todo Pago</option>
      </select>
    </div>
    
    <div>
      <label for="description" class="block text-sm font-medium mb-2">Descripción</label>
      <input
        id="description"
        type="text"
        bind:value={description}
        class="w-full p-2 border rounded"
        required
      />
    </div>
    
    <button
      type="submit"
      disabled={loading}
      class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
    >
      {loading ? 'Procesando...' : 'Crear Pago'}
    </button>
  </form>
</div>