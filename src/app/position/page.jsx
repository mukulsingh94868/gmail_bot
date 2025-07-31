import { fetchAppliedData, fetchOptions } from '@/actions/addPositionActions';
import AddPosition from '@/components/Position/AddPosition';
import React from 'react'

const page = async () => {
  const fetchOptionsData = await fetchOptions('position/options');
  const fetchAppliedDatas = await fetchAppliedData('apply/get-position-applied');
  return (
    <div>
      <AddPosition
        fetchOptionsData={fetchOptionsData?.data}
        fetchAppliedDatas={fetchAppliedDatas?.data}
      />
    </div>
  )
}

export default page;
