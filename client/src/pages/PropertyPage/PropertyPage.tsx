import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import styles from './PropertyPage.module.css';
import $api from '../../app/api/http';
import { CreatePropertyDto, IProperty, PropertyImage } from '../../models/IProperty';
import MyInput from '../../UI/MyInput/MyInput';
import MySelect from '../../UI/MySelect/MySelect';
import MyEditor from '../../UI/MyEditor/MyEditor';
import ImageGalleryEditor from './ImageGalleryEditor';
import InputRow from '../../UI/InputRow/InputRow';
import { RouteNames } from '../../app/router';
import { useTranslations } from '../../store/translations';

type IAction = 'create' | 'edit';

const PropertyPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const action: IAction = id ? 'edit' : 'create';
  const { translations } = useTranslations();
  const t = translations();

  const [form, setForm] = useState<CreatePropertyDto & { images: PropertyImage[] }>({
    title: '',
    price: 0,
    address: '',
    city: '',
    listingType: 'sale',
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    yearBuilt: undefined,
    description: '',
    agentId: 1,
    is_submission: false,
    images: [],
  });

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (action === 'edit' && id) {
      setLoading(true);
      $api.get<IProperty>(`/properties/by-id/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title,
            price: Number(data.price),
            address: data.address,
            city: data.city,
            listingType: data.listingType,
            propertyType: data.propertyType,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            yearBuilt: data.yearBuilt,
            description: data.description,
            agentId: data.agentId,
            is_submission: data.is_submission,
            images: data.images,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [action, id]);

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== undefined && key !== 'images') {
        fd.append(key, String(val));
      }
    });
    newFiles.forEach(file => fd.append('images', file));
    deletedUrls.forEach(url => fd.append('deletedImages', url));

    setLoading(true);
    try {
      if (action === 'create') {
        await $api.post('/properties', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await $api.put(`/properties/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
    } finally {
      setLoading(false);
      navigate(RouteNames.PROPERTIES);
    }
  };

  if (loading && action === 'edit' && form.title === '') {
    return <p>{t.loading}</p>;
  }

  return (
    <PageLayout
      pageTitle={action === 'create' ? t.addAnnouncement : t.editAnnouncement}
      actionTitle={action === 'create' ? t.addAnnouncement : t.save}
      action={handleSubmit}
    >
      <div className={styles.form}>
        <InputRow title={t.title}>
          <MyInput
            placeholder={t.title}
            value={form.title || ''}
            setValue={v => setForm(f => ({ ...f, title: v }))}
          />
        </InputRow>

        <InputRow title={t.priceEuro}>
          <MyInput
            placeholder={t.priceEuro}
            type="number"
            value={form.price.toString()}
            setValue={v => setForm(f => ({ ...f, price: Number(v) }))}
          />
        </InputRow>

        <InputRow title={t.address}>
          <MyInput
            placeholder={t.address}
            value={form.address}
            setValue={v => setForm(f => ({ ...f, address: v }))}
          />
        </InputRow>

        <InputRow title={t.city}>
          <MyInput
            placeholder={t.city}
            value={form.city}
            setValue={v => setForm(f => ({ ...f, city: v }))}
          />
        </InputRow>

        <InputRow title={t.listingType}>
          <MySelect
            placeholder={t.listingType}
            options={[
              { value: 'sale', label: t.sale },
              { value: 'rent', label: t.rent },
            ]}
            value={form.listingType}
            onChange={v => setForm(f => ({ ...f, listingType: v as 'sale' | 'rent' }))}
          />
        </InputRow>

        <InputRow title={t.propertyType}>
          <MyInput
            placeholder={t.propertyType}
            value={form.propertyType}
            setValue={v => setForm(f => ({ ...f, propertyType: v }))}
          />
        </InputRow>

        <InputRow title={t.bedrooms}>
          <MyInput
            placeholder={t.bedrooms}
            type="number"
            value={form.bedrooms.toString()}
            setValue={v => setForm(f => ({ ...f, bedrooms: Number(v) }))}
          />
        </InputRow>

        <InputRow title={t.bathrooms}>
          <MyInput
            placeholder={t.bathrooms}
            type="number"
            value={form.bathrooms.toString()}
            setValue={v => setForm(f => ({ ...f, bathrooms: Number(v) }))}
          />
        </InputRow>

        <InputRow title={t.yearBuilt}>
          <MyInput
            placeholder={t.yearBuilt}
            type="number"
            value={form.yearBuilt?.toString() || ''}
            setValue={v => setForm(f => ({ ...f, yearBuilt: v ? Number(v) : undefined }))}
          />
        </InputRow>

        <InputRow title={t.description}>
          <MyEditor
            value={form.description || ''}
            setValue={v => setForm(f => ({ ...f, description: v }))}
          />
        </InputRow>

        <InputRow title={t.addImage}>
          <ImageGalleryEditor
            existingUrls={form.images}
            onAdd={files => setNewFiles(f => [...f, ...files])}
            onDeleteUrl={url => {
              setForm(f => ({
                ...f,
                images: f.images.filter(u => u.fullUrl !== url),
              }));
              setDeletedUrls(d => [...d, url]);
            }}
          />
        </InputRow>
      </div>
    </PageLayout>
  );
};

export default PropertyPage;
