const supabase = require("./supabase");

async function fetchBillByTitle(title) {
  const { data, error } = await supabase
    .from("bills")
    .select()
    .eq("title", title);
  return data;
}

exports.fetchBillByTitle = fetchBillByTitle;

async function fetchBills(userId) {
  const { data, error } = await supabase
    .from("bills")
    .select()
    .eq("user_id", userId);

  return data;
}

exports.fetchBills = fetchBills;

async function deleteBill(id) {}

exports.deleteBill = deleteBill;

async function fetchUserByPhoneNumber(phoneNumber) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("phone_number", phoneNumber);

  return data;
}

async function storeNewUser(text, phoneNumber) {
  const [name] = text;

  const { data, error } = await supabase.from("users").insert({
    name,
    phone_number: phoneNumber,
  });

  if (error) {
    console.log(error);
    return;
  }

  return data;
}

async function storeNewBill(text, user_id) {
  const recurrenceMap = {
    1: "daily",
    2: "weekly",
    3: "monthly",
    4: "yearly",
  };

  const methodMap = {
    1: "paybill",
    2: "till",
    3: "phone",
  };

  if (text.length === 7) {
    // paybill track
    const [
      title,
      method,
      businessNumber,
      accountNumber,
      amount,
      recurrence,
      reccurence_option,
    ] = text;

    const { data, error } = await supabase
      .from("bills")
      .insert({
        title,
        business_number: businessNumber,
        account_number: accountNumber,
        amount: amount,
        payment_method: methodMap[method],
        paid: false,
        recurrence: recurrenceMap[recurrence],
        user_id,
      })
      .select();

    console.log("bill", data);
    return data;
  } else {
    // till or phone track
    const [
      title,
      method,
      phone_or_till_number,
      amount,
      recurrence,
      reccurence_option,
    ] = text;

    let phone_number = null;
    let till_number = null;

    if (method === "2") {
      till_number = phone_or_till_number;
    } else {
      phone_number = phone_or_till_number;
    }

    const { data, error } = await supabase
      .from("bills")
      .insert({
        title,
        payment_method: methodMap[method],
        phone_number,
        till_number,
        amount,
        recurrence: recurrenceMap[recurrence],
        user_id,
        paid: false,
      })
      .select();
    console.log("bill", data);
    return data;
  }
}

exports.storeNewBill = storeNewBill;
exports.storeNewUser = storeNewUser;
exports.fetchUserByPhoneNumber = fetchUserByPhoneNumber;
