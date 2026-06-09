export type Work = {
  id: string;
  work_title: string;
  category?: string;
  work_desc: string;
  work_tech?: string;
  work_about?: string;
  work_bg?: string;
  work_img?: {
    url: string;
    height: number;
    width: number;
  };
  work_sub_imgs?: [{ url: string; height: number; width: number }];
  href?: string;
};

export type ContactFormData = {
  name: string;
  company: string;
  email: string;
  subject: string;
  message: string;
};
