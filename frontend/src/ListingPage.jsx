import React from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

import Listing from './Listing';

export default () => {
  return <Listing {...listing} />;
};
