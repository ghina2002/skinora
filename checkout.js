document.addEventListener("DOMContentLoaded", function () {

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemsBox = document.getElementById("summary-items");
  const totalBox = document.getElementById("summary-total");

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    itemsBox.innerHTML += `
      <div>
        <h4>${item.name}</h4>
        <p>${item.qty} x $${item.price}</p>
      </div>
    `;
  });

  totalBox.innerText = total;
});

async function submitOrder() {

  console.log("CLICKED WORKS ✅");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const phone = document.getElementById("phone").value;
  const firstName = document.getElementById("first_name").value;
  const lastName = document.getElementById("last_name").value;
  const address = document.getElementById("address").value;

  // 1️⃣ نحفظ order
  const { data, error } = await window.supabaseClient
    .from("orders")
    .insert([{ phone, first_name: firstName, last_name: lastName, address }])
    .select();

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  const orderId = data[0].id;

  // 2️⃣ نحفظ order_items (هيدا اللي ناقص عندك ❌)
  for (let item of cart) {
    const { error: itemError } = await window.supabaseClient
      .from("order_items")
      .insert([{
        phone,
        order_id: orderId,
        product_name: item.name,
        price: item.price,
        qty: item.qty
      }]);

    if (itemError) {
      console.log(itemError);
    }
  }

  localStorage.removeItem("cart");

  alert("Order saved successfully!");
}
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("continueBtn").onclick = submitOrder;
});
