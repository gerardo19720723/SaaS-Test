import { e as createComponent, k as renderHead, l as renderComponent, r as renderTemplate } from '../chunks/astro/server_DLUMexeE.mjs';
import 'piccolore';
import { p as push, a as pop } from '../chunks/_@astro-renderers_HEXNp3S5.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_HEXNp3S5.mjs';

const ATTR_REGEX = /[&"<]/g;
const CONTENT_REGEX = /[&<]/g;

/**
 * @template V
 * @param {V} value
 * @param {boolean} [is_attr]
 */
function escape_html(value, is_attr) {
	const str = String(value ?? '');

	const pattern = is_attr ? ATTR_REGEX : CONTENT_REGEX;
	pattern.lastIndex = 0;

	let escaped = '';
	let last = 0;

	while (pattern.test(str)) {
		const i = pattern.lastIndex - 1;
		const ch = str[i];
		escaped += str.substring(last, i) + (ch === '&' ? '&amp;' : ch === '"' ? '&quot;' : '&lt;');
		last = i + 1;
	}

	return escaped + str.substring(last);
}

/**
 * `<div translate={false}>` should be rendered as `<div translate="no">` and _not_
 * `<div translate="false">`, which is equivalent to `<div translate="yes">`. There
 * may be other odd cases that need to be added to this list in future
 * @type {Record<string, Map<any, string>>}
 */
const replacements = {
	translate: new Map([
		[true, 'yes'],
		[false, 'no']
	])
};

/**
 * @template V
 * @param {string} name
 * @param {V} value
 * @param {boolean} [is_boolean]
 * @returns {string}
 */
function attr(name, value, is_boolean = false) {
	if (value == null || (!value && is_boolean) || (value === '' && name === 'class')) return '';
	const normalized = (name in replacements && replacements[name].get(value)) || value;
	const assignment = is_boolean ? '' : `="${escape_html(normalized, true)}"`;
	return ` ${name}${assignment}`;
}

function AuthForm($$payload, $$props) {
	push();

	let email = '';
	let password = '';
	let loading = false;

	$$payload.out += `<div class="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto"><h2 class="text-2xl font-bold mb-4">${escape_html('Iniciar Sesión' )}</h2> <form class="space-y-4">`;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <input type="email"${attr('value', email)} placeholder="Email" class="w-full p-2 border rounded" required> <input type="password"${attr('value', password)} placeholder="Contraseña" class="w-full p-2 border rounded" required> <button type="submit"${attr('disabled', loading, true)} class="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">${escape_html('Ingresar' )}</button></form> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <div class="mt-4 text-center"><button class="text-blue-500 hover:underline">${escape_html('¿No tienes cuenta? Regístrate' )}</button></div></div>`;
	pop();
}

function PaymentForm($$payload, $$props) {
	push();

	let amount = 1000;
	let description = 'Suscripción mensual';
	let loading = false;

	$$payload.out += `<div class="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8"><h2 class="text-2xl font-bold mb-4">Crear Pago</h2> `;

	{
		$$payload.out += '<!--[!-->';
	}

	$$payload.out += `<!--]--> <form class="space-y-4"><div><label for="amount" class="block text-sm font-medium mb-2">Monto (ARS)</label> <input id="amount" type="number"${attr('value', amount)} min="1" class="w-full p-2 border rounded" required></div> <div><label for="provider" class="block text-sm font-medium mb-2">Pasarela de Pago</label> <select id="provider" class="w-full p-2 border rounded"><option value="stripe">Stripe</option><option value="mercadopago">Mercado Pago</option><option value="todopago">Todo Pago</option></select></div> <div><label for="description" class="block text-sm font-medium mb-2">Descripción</label> <input id="description" type="text"${attr('value', description)} class="w-full p-2 border rounded" required></div> <button type="submit"${attr('disabled', loading, true)} class="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50">${escape_html('Crear Pago')}</button></form></div>`;
	pop();
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>SaaS Test - Multi-Pasarela</title>${renderHead()}</head> <body> <nav class="bg-blue-600 text-white p-4"> <div class="container mx-auto"> <h1 class="text-xl font-bold">SaaS Test - Pagos Múltiples</h1> </div> </nav> <main class="container mx-auto p-8"> <h1 class="text-4xl font-bold text-center mb-8 text-blue-600">
🚀 SaaS Test - Stripe, MercadoPago, TodoPago
</h1> ${renderComponent($$result, "AuthForm", AuthForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/gerar/SaaS-Test/frontend/src/components/AuthForm.svelte", "client:component-export": "default" })} ${renderComponent($$result, "PaymentForm", PaymentForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/home/gerar/SaaS-Test/frontend/src/components/PaymentForm.svelte", "client:component-export": "default" })} </main> </body></html>`;
}, "/home/gerar/SaaS-Test/frontend/src/pages/index.astro", void 0);

const $$file = "/home/gerar/SaaS-Test/frontend/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
