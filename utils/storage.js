const supabase = require("./supabase");

async function fetchUserByPhoneNumber(phoneNumber) {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("phone_number", phoneNumber);

  return data;
}

async function storeNewUser(text, phoneNumber) {
  const [title, _phone, _id] = text;

  const { data, error } = await supabase.from("users").insert({
    title,
    phone_number: phoneNumber,
  });
}

async function storeNewBill(text, phoneNumber) {
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

    const { data: user, error: userError } = await supabase
      .from("users")
      .select()
      .eq("phone_number", phoneNumber);

    const { data, error } = await supabase.from("bills").insert({
      title,
      business_number: businessNumber,
      account_number: accountNumber,
      amount: amount,
      payment_method: methodMap[method],
      paid: false,
      recurrence: recurrenceMap[recurrence],
      user_id: user[0].id,
    });
  } else {
    // till or phone track
  }
}

exports.storeNewBill = storeNewBill;
exports.storeNewUser = storeNewUser;
exports.fetchUserByPhoneNumber = fetchUserByPhoneNumber;
