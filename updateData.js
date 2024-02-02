const API_KEY = '###################';
const BASE_ID = '###################';
const TABLE_NAME = '###################';

const updateStatusField = async (saleOrderId, buyerOrderId, value, eventType) => {
  const fieldToUpdate = eventType === 'เข้ารับสินค้า' ? 'Receive Parcel (Test)' : 'Deliver to Buyer (Test)';
  const filterFormula = `AND({Sale Order ID} = "${saleOrderId}", {Buyer Order ID} = "${buyerOrderId}")`;
  const updateEndpoint = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?filterByFormula=${encodeURIComponent(filterFormula)}`;

  try {
    // Fetch records with the specified filter
    const recordsResponse = await fetch(updateEndpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    const recordsData = await recordsResponse.json();

    if (recordsData.records.length > 0) {
      // Update the first record found with the specified filter
      const recordId = recordsData.records[0].id;
      const updateResponse = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            [fieldToUpdate]: value,
          },
        }),
      });

      const updatedRecord = await updateResponse.json();
      console.log('Updated Record:', updatedRecord);
    } else {
      console.log('Record not found with the specified conditions.');
    }
  } catch (error) {
    console.error('Error updating record:', error);
  }
};

// Example usage with loop
const unPivotData = dhlAndunPivotDataUsing.data;

for (let i = 0; i < unPivotData.length; i++) {
  let saleOrderId = orderId[i].value;
  let buyerOrderId = NocNocOrder[i].value;
  const updateValue = pickUpSwitch[i].value;
  const eventType = text11[i].value; // Assuming text11.value is defined somewhere

  await updateStatusField(saleOrderId, buyerOrderId, updateValue, eventType);
}
