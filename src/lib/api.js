const RESULTS_URL = import.meta.env.VITE_RESULTS_API_URL || 'api/v4/survey/results';

export async function fetchResults({ signal } = {}) {
  let response;

  try {
    response = await fetch(RESULTS_URL, {
      headers: { Accept: 'application/json' },
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('تعذّر الاتصال بخادم النتائج.');
  }

  if (!response.ok) {
    throw new Error('تعذّر تحميل النتائج من الخادم.');
  }

  const body = await response.text();
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    throw new Error('وصلت استجابة غير صالحة من الخادم.');
  }

  if (!payload?.success || !payload.data || !Array.isArray(payload.data.ranking)) {
    throw new Error(payload?.message || 'بيانات النتائج غير مكتملة.');
  }

  return payload.data;
}
