import { CanAccess } from '@refinedev/core';
import { ProductDrawerForm } from '../../components';
import { Unauthorized } from '../../components/unauthorized';

export const ProductEdit = () => {
  return (
    <>
      <CanAccess
        resource="products"
        action="edit"
        fallback={<Unauthorized />}
      >
        <ProductDrawerForm action="edit" />;
      </CanAccess>
    </>
  );
};
