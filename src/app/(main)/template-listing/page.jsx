
import { fetchTemplates } from '@/actions/templateListingActons';
import TemplatesListing from '@/components/TemplateListing/TemplateListing';
import React from 'react'

const page = async () => {
  const templateData = await fetchTemplates('position/getUserPositions');
  return (
    <div>
      <TemplatesListing templateData={templateData?.data} />
    </div>
  )
}

export default page;
