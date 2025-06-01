import { CanAccess } from '@refinedev/core';
import { ProductDrawerForm } from '../../components';
import { Unauthorized } from '../../components/unauthorized';

export const ProductCreate = () => {
  return (
    <>
      <CanAccess
        resource="products"
        action="create"
        fallback={<Unauthorized />}
      >
        <ProductDrawerForm action="create" />;
      </CanAccess>
    </>
  );
};
