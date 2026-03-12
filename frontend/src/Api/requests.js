const API_BASE = "http://localhost:5000/api/requests";

export async function getAllRequests() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch requests");
  return res.json();
}


export async function createRequest(values) {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("description", values.description);
  formData.append("createdById", "USER123");
  formData.append("createrRole", 1);

  if (values.file && values.file[0]) {
    formData.append("templateFile", values.file[0].originFileObj);
  }

  const res = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });

  return res.json();
}
