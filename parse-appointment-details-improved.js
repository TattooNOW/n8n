// Parse detailed appointment SOAP response for EACH item
const item = $input.item;
const xmlResponse = item.json.data || item.json;

// Helper function to extract XML tag content (handles namespaces)
function getTagContent(xml, tagName) {
  // Try with namespace prefix first (a:TagName, tem:TagName, etc.)
  const regexWithNS = new RegExp(`<[a-zA-Z]+:${tagName}[^>]*>([\\s\\S]*?)</[a-zA-Z]+:${tagName}>`, 'i');
  const matchWithNS = xml.match(regexWithNS);
  if (matchWithNS) return matchWithNS[1].trim();

  // Try without namespace
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

// Debug: Log the XML response (first 1000 chars)
console.log('XML Response Preview:', xmlResponse.substring(0, 1000));

// Check for errors
const isError = getTagContent(xmlResponse, 'IsError');
if (isError === 'true') {
  const errorMessage = getTagContent(xmlResponse, 'ErrorMessage');
  throw new Error(`Tebra API Error: ${errorMessage}`);
}

// Extract appointment details - try both "Appointment" and "AppointmentData"
let appointmentBlock = getTagContent(xmlResponse, 'Appointment');
if (!appointmentBlock) {
  appointmentBlock = getTagContent(xmlResponse, 'AppointmentData');
}

if (!appointmentBlock) {
  console.log('No appointment block found in response');
  return [];
}

// Debug: Log found appointment block (first 500 chars)
console.log('Appointment Block Preview:', appointmentBlock.substring(0, 500));

// Parse all available fields from the detailed response
const details = {
  appointmentId: getTagContent(appointmentBlock, 'ID'),
  patientFullName: getTagContent(appointmentBlock, 'PatientFullName'),
  patientId: getTagContent(appointmentBlock, 'PatientID'),
  startDate: getTagContent(appointmentBlock, 'StartDate'),
  endDate: getTagContent(appointmentBlock, 'EndDate'),
  appointmentType: getTagContent(appointmentBlock, 'Type'),
  notes: getTagContent(appointmentBlock, 'Notes'),
  resourceName: getTagContent(appointmentBlock, 'ResourceName1'),
  resourceId: getTagContent(appointmentBlock, 'ResourceID1'),
  duration: getTagContent(appointmentBlock, 'Duration'),
  appointmentLength: getTagContent(appointmentBlock, 'AppointmentLength'),
  minutes: getTagContent(appointmentBlock, 'Minutes'),
  serviceLocationName: getTagContent(appointmentBlock, 'ServiceLocationName'),
  caseId: getTagContent(appointmentBlock, 'CaseID'),
  status: getTagContent(appointmentBlock, 'AppointmentStatus'),
  confirmedDate: getTagContent(appointmentBlock, 'ConfirmedDate'),
  createdDate: getTagContent(appointmentBlock, 'CreatedDate'),
  modifiedDate: getTagContent(appointmentBlock, 'ModifiedDate')
};

// Debug: Log which fields are null
const nullFields = Object.entries(details)
  .filter(([key, value]) => value === null)
  .map(([key]) => key);

if (nullFields.length > 0) {
  console.log('Fields returning null:', nullFields.join(', '));
}

// Debug: Log which fields have values
const populatedFields = Object.entries(details)
  .filter(([key, value]) => value !== null)
  .map(([key, value]) => `${key}: ${value}`);

console.log('Populated fields:', populatedFields.join(', '));

return { json: details };
