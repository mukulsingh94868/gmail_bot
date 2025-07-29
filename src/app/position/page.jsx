// import { fetchOptions } from '@/actions/addPositionActions';
import AddPosition from '@/components/Position/AddPosition';
import React from 'react'

const page = async () => {
  // const fetchOptionsData = await fetchOptions('position/options');
  // console.log('fetchOptionsData', fetchOptionsData);
  return (
    <div>
      <AddPosition
      // fetchOptionsData={fetchOptionsData} 
      />
    </div>
  )
}

export default page;
