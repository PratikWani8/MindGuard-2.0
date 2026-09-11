export const success = (res, data = {}, message = "Success", status = 200) =>
  res.status(status).json({ success: true, data, message });

export const failure = (res, message = "Request failed", errors = [], status = 400) =>
  res.status(status).json({ success: false, message, errors });