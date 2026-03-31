const arabicStatusToEnglish = {
  'جديد': 'NEW',
  'بانتظار الموافقة': 'AWAITING_APPROVAL',
  'تمت الموافقة': 'APPROVED',
  'قيد التنفيذ': 'IN_PROGRESS',
  'معلق': 'ON_HOLD',
  'مكتمل': 'COMPLETED',
  'أعيد فتحه': 'REOPENED',
  'ملغي': 'CANCELLED'
};

const arabicChecklistToEnglish = {
  'فحص المضخة': 'inspect_pump',
  'تنظيف الفلتر': 'clean_filter',
  'اختبار الكهرباء': 'test_power',
  'التأكد من السلامة': 'verify_safety',
  'إغلاق الطلب': 'close_request'
};

const arabicWorkflowActionToEnglish = {
  'بدء العمل': 'START_WORK',
  'إنهاء العمل': 'FINISH_WORK',
  'طلب موافقة': 'REQUEST_APPROVAL',
  'إعادة فتح': 'REOPEN_REQUEST',
  'إضافة ملاحظة': 'ADD_COMMENT'
};

function normalizeStatus(value) {
  if (!value) return value;
  return arabicStatusToEnglish[value] || String(value).toUpperCase();
}
function normalizeChecklistLabel(value) {
  if (!value) return value;
  return arabicChecklistToEnglish[value] || value;
}
function normalizeWorkflowAction(value) {
  if (!value) return value;
  return arabicWorkflowActionToEnglish[value] || String(value).toUpperCase();
}
function normalizeArabicFormValues(payload = {}) {
  return {
    ...payload,
    status: normalizeStatus(payload.status),
    checklistKey: normalizeChecklistLabel(payload.checklistKey),
    workflowEvent: normalizeWorkflowAction(payload.workflowEvent)
  };
}
module.exports = {
  arabicStatusToEnglish, arabicChecklistToEnglish, arabicWorkflowActionToEnglish,
  normalizeStatus, normalizeChecklistLabel, normalizeWorkflowAction, normalizeArabicFormValues
};
