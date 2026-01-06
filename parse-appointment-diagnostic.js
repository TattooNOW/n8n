// DIAGNOSTIC VERSION - Use this to see what XML you're actually receiving
const item = $input.item;
const xmlResponse = item.json.data || item.json;

// Helper function to extract XML tag content (handles namespaces)
function getTagContent(xml, tagName) {
  const regexWithNS = new RegExp(`<[a-zA-Z]+:${tagName}[^>]*>([\\s\\S]*?)</[a-zA-Z]+:${tagName}>`, 'i');
  const matchWithNS = xml.match(regexWithNS);
  if (matchWithNS) return matchWithNS[1].trim();

  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

// Function to extract all tag names from XML
function extractAllTags(xml) {
  const tagRegex = /<([a-zA-Z0-9_:]+)[\s>]/g;
  const tags = new Set();
  let match;

  while ((match = tagRegex.exec(xml)) !== null) {
    // Remove namespace prefix for cleaner display
    const tagName = match[1].includes(':') ? match[1].split(':')[1] : match[1];
    tags.add(tagName);
  }

  return Array.from(tags).sort();
}

// Extract appointment block
let appointmentBlock = getTagContent(xmlResponse, 'Appointment');
if (!appointmentBlock) {
  appointmentBlock = getTagContent(xmlResponse, 'AppointmentData');
}

if (!appointmentBlock) {
  // Return the full XML and all tags found
  return {
    json: {
      debug: true,
      message: 'No appointment block found',
      fullXmlPreview: xmlResponse.substring(0, 2000),
      allTagsInResponse: extractAllTags(xmlResponse)
    }
  };
}

// Show what's available in the appointment block
const availableTags = extractAllTags(appointmentBlock);

// Try to extract all fields
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

return {
  json: {
    ...details,
    _debug: {
      availableTagsInAppointmentBlock: availableTags,
      appointmentBlockPreview: appointmentBlock.substring(0, 1000),
      nullFields: Object.entries(details).filter(([k, v]) => v === null).map(([k]) => k)
    }
  }
};
