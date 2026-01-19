import { HotToastService } from '@ngneat/hot-toast';

export const successToast = (toast: HotToastService, msg: string) => {
  toast.success(msg);
};

export const errorToast = (toast: HotToastService, msg: string) => {
  toast.error(msg);
};
