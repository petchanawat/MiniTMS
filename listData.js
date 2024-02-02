const API_KEY = '##############################';
const BASE_ID = '##############################';
const TABLE_NAME = '##############################';
const VIEW_NAME = '##############################';
const BATCH_SIZE = 100;

let offset = '';
let allRecords = [];

while (true) {
    const endpoint = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?offset=${offset}&limit=${BATCH_SIZE}&view=${encodeURIComponent(VIEW_NAME)}`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const jsonData = await response.json();

        if (!jsonData.records || jsonData.records.length === 0) {
            // No more records, break the loop
            break;
        }

        // Concatenate the batch with the existing records
        allRecords = allRecords.concat(jsonData.records);

        // Update the offset for the next batch
        offset = jsonData.offset;
    } catch (error) {
        console.error('Error fetching data:', error);
        break;
    }
}

// Transform the data if needed
const transformedData = allRecords.map(record => {
    const transformedRecord = {};
    for (const key in record.fields) {
        transformedRecord[key] = record.fields[key];
    }

    // Include specific fields
    transformedRecord['Pickup Order'] = record.fields['Pickup Order'];
    transformedRecord['Deliver Order'] = record.fields['Deliver Order'];
    transformedRecord['Receive Parcel (Test)'] = record.fields['Receive Parcel (Test)'];
    transformedRecord['Delivered to buyer (Test)'] = record.fields['Delivered to buyer (Test)'];
    transformedRecord['Receive Parcel Time (Test)'] = record.fields['Receive Parcel Time (Test)'];
    transformedRecord['Delivered Time (Test)'] = record.fields['Delivered Time (Test)'];
    transformedRecord['Recieve Parcel Time'] = record.fields['Recieve Parcel Time'];
    transformedRecord['Delivered Time'] = record.fields['Delivered Time'];
    transformedRecord['Evidence of Pickup'] = record.fields['Evidence of Pickup'];
    transformedRecord['Evidence of Delivery'] = record.fields['Evidence of Delivery'];
    transformedRecord['Password for Mini TMS'] = record.fields['Password for Mini TMS'];
    transformedRecord['carrierName for Mini TMS'] = record.fields['carrierName for Mini TMS'];
    transformedRecord['Note for Pickup'] = record.fields['Note for Pickup'];
    transformedRecord['Note for Delivery'] = record.fields['Note for Delivery'];
    transformedRecord['Ordered Record Driver Name'] = record.fields['Ordered Record Driver Name'];
    transformedRecord['First Mile of The Day'] = record.fields['First Mile of The Day'];
    transformedRecord['First Mile Timestamp'] = record.fields['First Mile Timestamp'];
    transformedRecord['Last Mile of The Day'] = record.fields['Last Mile of The Day'];
    transformedRecord['Last Mile Timestamp'] = record.fields['Last Mile Timestamp'];
    transformedRecord['Delivery Comments (Number of Boxes)'] = record.fields['Delivery Comments (Number of Boxes)'];  


    return transformedRecord;
});

// Filter the transformedData based on specific conditions
const filteredData = transformedData.filter(record => {
  return (
    record['Ordered Record Driver Name'] === select2.value &&
    record['Password for Mini TMS'] === textInput4.value &&
    record['Pick Up Date&Time (From)'].substr(0, 10) === selectedDate.data.substr(0, 10)
  );
});

// Now, continue with the rest of the code
const originalData = filteredData;

// Function to unpivot the specified columns
const unpivotColumns = (data, pickupColumnName, deliverColumnName) => {
  const unpivotedData = [];

  const convertTo24HourFormat = (timeString) => {
  const [time, period] = timeString.split(' ');

  let [hours, minutes, seconds] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

// Your existing code...

data.forEach(row => {
  if (row[pickupColumnName]) {
    const pickupDate = new Date(row['Pick Up Date&Time (From)']);

    const pickupTimeOptions = {
      timeZone: 'Asia/Bangkok',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const formattedPickupTime = new Intl.DateTimeFormat('en-TH', pickupTimeOptions).format(pickupDate);

    const [month, day, yearAndTime] = formattedPickupTime.split('/');
    const [year, time] = yearAndTime.split(', ');

    // Reformatting to dd/mm/yy HH:MM:SS (24-hour time)
    const pickupTime = `${day}/${month}/${year}, ${convertTo24HourFormat(time)}`;

    unpivotedData.push({
      // Copy other columns as is
      ...row,
      // Add a new column for the event type (Pickup or Deliver)
      EventType: 'เข้ารับสินค้า',
      // Add a new column for the date time
      Rank: row[pickupColumnName],
      // Add a new column for the formatted pickup date
      'Pick Up Date&Time (Formatted)': pickupTime,

        // Add a new column for the value from dhlEcommerce['Receive Parcel (Test)']
        trueOrFalse: row['Receive Parcel (Test)'],
        taskTime: row['Recieve Parcel Time'] ? new Date(row['Recieve Parcel Time']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
        evidence: row['Evidence of Pickup'],
        notes: row['Note for Pickup'],
        nameZ: row['Seller Name (SellerName+WH Name)'],
        phoneZ: row['WH Phone'],
        firstMileTime: row['First Mile Timestamp'] ? new Date(row['First Mile Timestamp']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
        lastMileTime: row['Last Mile Timestamp'] ? new Date(row['Last Mile Timestamp']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
      });
    }

    if (row[deliverColumnName]) {
      unpivotedData.push({
        // Copy other columns as is
        ...row,
        // Add a new column for the event type (Pickup or Deliver)
        EventType: 'ส่งสินค้า',
        // Add a new column for the date time
        Rank: row[deliverColumnName],
        // Add a new column for the formatted pickup date
        'Pick Up Date&Time (Formatted)': row['Window Time'], // Adjust this if you want to add a formatted date for deliveries

        // Add a new column for the value from dhlEcommerce['Delivered to buyer (Test)']
        trueOrFalse: row['Deliver to Buyer (Test)'],
        taskTime: row['Delivered Time'] ? new Date(row['Delivered Time']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
        evidence: row['Evidence of Delivery'],
        notes: row['Note for Delivery'],
        nameZ: row['Customer Name'],
        phoneZ: row['Buyer Phone (New)'],
        firstMileTime: row['First Mile Timestamp'] ? new Date(row['First Mile Timestamp']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
        lastMileTime: row['Last Mile Timestamp'] ? new Date(row['Last Mile Timestamp']).toLocaleString('en-TH', { timeZone: 'Asia/Bangkok' }) : '',
      });
    }
  });

  return unpivotedData;
};

// Unpivot the specified columns
const unpivotedPickupDeliverData = unpivotColumns(originalData, 'Pickup Order', 'Deliver Order');

// Sort the result by the Rank column
const sortedData = unpivotedPickupDeliverData.sort((a, b) => a.Rank - b.Rank);

return sortedData;
