import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import styles from './PropertyPage.module.css';
import $api from '../../app/api/http';
import { CreatePropertyDto, IProperty } from '../../models/IProperty';
import MyInput from '../../UI/MyInput/MyInput';
import MySelect from '../../UI/MySelect/MySelect';
import MyEditor from '../../UI/MyEditor/MyEditor';
import ImageGalleryEditor from './ImageGalleryEditor';
import InputRow from '../../UI/InputRow/InputRow';

type IAction = 'create' | 'edit';

const PropertyPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const action: IAction = id ? 'edit' : 'create';

    // Локальний стейт форми
    const [form, setForm] = useState<CreatePropertyDto & { images: string[] }>({
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
        images: [], // тут зберігатимемо URL існуючих фото
    });

    // Нові файли та видалені URL
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // При монтуванні, якщо edit — підвантажуємо існуючі дані
    useEffect(() => {
        if (action === 'edit' && id) {
            setLoading(true);
            $api.get<IProperty>(`/properties/by-id/${id}`)
                .then(({ data }) => {
                    console.log(data)
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
                        images: data.images, // передамо масив URL
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [action, id]);

    const handleSubmit = async () => {
        const fd = new FormData();
        // Додаємо прості поля
        Object.entries(form).forEach(([key, val]) => {
            if (
                val !== undefined &&
                key !== 'images' // масив існуючих зображень ми не апендим сюди
            ) {
                fd.append(key, String(val));
            }
        });
        // Нові файли
        newFiles.forEach(file => {
            fd.append('images', file);
        });
        // Видалені фото (сервер повинен зрозуміти цей параметр)
        deletedUrls.forEach(url => {
            fd.append('deletedImages', url);
        });

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
            // після успіху можна перенаправити
            // navigate(...)
        } finally {
            setLoading(false);
        }
    };

    if (loading && action === 'edit' && form.title === '') {
        return <p>Завантаження...</p>;
    }

    return (
        <PageLayout
            pageTitle={action === 'create' ? 'Створити оголошення' : 'Редагувати оголошення'}
            actionTitle={action === 'create' ? 'Створити' : 'Зберегти'}
            action={handleSubmit}
        >
            <div className={styles.form}>
                <InputRow title="Назва">
                    <MyInput
                        placeholder="Назва"
                        value={form.title || ''}
                        setValue={v => setForm(f => ({ ...f, title: v }))}
                    />
                </InputRow>

                <InputRow title="Ціна (€)">
                    <MyInput
                        placeholder="Ціна (€)"
                        type="number"
                        value={form.price.toString()}
                        setValue={v => setForm(f => ({ ...f, price: Number(v) }))}
                    />
                </InputRow>

                <InputRow title="Адреса">
                    <MyInput
                        placeholder="Адреса"
                        value={form.address}
                        setValue={v => setForm(f => ({ ...f, address: v }))}
                    />
                </InputRow>

                <InputRow title="Місто">
                    <MyInput
                        placeholder="Місто"
                        value={form.city}
                        setValue={v => setForm(f => ({ ...f, city: v }))}
                    />
                </InputRow>

                <InputRow title="Тип оголошення">
                    <MySelect
                        placeholder="Тип оголошення"
                        options={[
                            { value: 'sale', label: 'Продаж' },
                            { value: 'rent', label: 'Оренда' },
                        ]}
                        value={form.listingType}
                        onChange={v => setForm(f => ({ ...f, listingType: v as 'sale' | 'rent' }))}
                    />
                </InputRow>

                <InputRow title="Тип нерухомості">
                    <MyInput
                        placeholder="Тип нерухомості"
                        value={form.propertyType}
                        setValue={v => setForm(f => ({ ...f, propertyType: v }))}
                    />
                </InputRow>

                <InputRow title="Спальні">
                    <MyInput
                        placeholder="Спальні"
                        type="number"
                        value={form.bedrooms.toString()}
                        setValue={v => setForm(f => ({ ...f, bedrooms: Number(v) }))}
                    />
                </InputRow>

                <InputRow title="Ванни">
                    <MyInput
                        placeholder="Ванни"
                        type="number"
                        value={form.bathrooms.toString()}
                        setValue={v => setForm(f => ({ ...f, bathrooms: Number(v) }))}
                    />
                </InputRow>

                <InputRow title="Рік побудови">
                    <MyInput
                        placeholder="Рік побудови"
                        type="number"
                        value={form.yearBuilt?.toString() || ''}
                        setValue={v => setForm(f => ({ ...f, yearBuilt: v ? Number(v) : undefined }))}
                    />
                </InputRow>

                <InputRow title="Опис">
                    <MyEditor
                        value={form.description || ''}
                        setValue={v => setForm(f => ({ ...f, description: v }))}
                    />
                </InputRow>

                <InputRow title="Галерея фото">
                    <ImageGalleryEditor
                        existingUrls={form.images}
                        onAdd={files => setNewFiles(f => [...f, ...files])}
                        onDeleteUrl={url => {
                            setForm(f => ({
                                ...f,
                                images: f.images.filter(u => u !== url),
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
