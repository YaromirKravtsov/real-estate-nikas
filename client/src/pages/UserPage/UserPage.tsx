import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import { IUser } from '../../models/IUser';
import $api, { API_URL } from '../../app/api/http';
import MyInput from '../../UI/MyInput/MyInput';
import MyButton from '../../UI/MyButton/MyButton';
import styles from './UserPage.module.css';
import ImagePicker from '../../components/ImagePicker/ImagePicker';

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Partial<IUser>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user',
    profileImageUrl: '',
  });
  const [profileFile, setProfileFile] = useState<File>()

  useEffect(() => {
    if (isEdit) {
      // fetch existing user
      $api.get<IUser>(`users/${id}`).then(({ data }) => {
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          profileImageUrl: data.profileImageUrl
        });
      });
    }
  }, [id, isEdit]);
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName?.trim()) {
      newErrors.firstName = 'Ім\'я є обов\'язковим полем';
    }

    if (!form.lastName?.trim()) {
      newErrors.lastName = 'Прізвище є обов\'язковим полем';
    }

    if (!form.email?.trim()) {
      newErrors.email = 'Email є обов\'язковим полем';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Введіть коректний email';
    }

    if (!form.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Номер телефону є обов\'язковим полем';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };




  const handleAction = async () => {
    if (!validateForm()) {
      return;
    }

    const fd = new FormData();
    // append form fields
    Object.entries(form).forEach(([key, val]) => {
      if (val != null) {
        // замінить існуюче значення, а не додасть ще одне
        fd.set(key, String(val));
      }
    });

    if (profileFile) {
      // теж саме для файлу
      fd.set('profileImageUrl', profileFile);
    }


    try {
      let userId: any = null;
      if (isEdit) {
        await $api.put(`users/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const { data } = await $api.post('/users/agent', fd);

        userId = data.id
      }
      navigate(`/users/`)
    } catch (err) {
      console.error(err);
      alert('Помилка при збереженні');
    }
  };

  const handleRemove = async () => {
    if (!isEdit || !id) return;

    if (!window.confirm('Ви впевнені, що хочете видалити цього користувача?')) {
      return;
    }

    try {
      await $api.delete(`users/${id}`);
      navigate('/users');
    } catch (err) {
      console.error(err);
      alert('Помилка при видаленні користувача');
    }
  };

  return (
    <PageLayout
      actionTitle={isEdit ? 'Зберегти' : 'Створити'}
      action={handleAction}
      pageTitle={isEdit ? 'Редагувати користувача' : 'Створити користувача'}
      removeAction={isEdit ? handleRemove : undefined}
    >
      <div className={styles.container}>
        <div className={styles.leftColumn}>
      
          <ImagePicker
            initialImageUrl={form.profileImageUrl ?? null}
            onFileChange={setProfileFile}
            containerClassName={styles.profileImageContainer}
            imageClassName={styles.profileImage}
            buttonClassName={styles.uploadButton}
          />

        </div>
        <div className={styles.rightColumn}>
          <div>
            <MyInput
              name="firstName"
              placeholder="Ім'я"
              value={form.firstName || ''}
              onChange={handleChange}
            />
            {errors.firstName && (
              <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.firstName}
              </div>
            )}
          </div>

          <div>
            <MyInput
              name="lastName"
              placeholder="Прізвище"
              value={form.lastName || ''}
              onChange={handleChange}
            />
            {errors.lastName && (
              <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.lastName}
              </div>
            )}
          </div>

          <div>
            <MyInput
              name="email"
              placeholder="Email"
              type="email"
              value={form.email || ''}
              onChange={handleChange}
            />
            {errors.email && (
              <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.email}
              </div>
            )}
          </div>

          <div>
            <MyInput
              name="phoneNumber"
              placeholder="Телефон"
              value={form.phoneNumber || ''}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <div style={{ color: 'red', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                {errors.phoneNumber}
              </div>
            )}
          </div>


        </div>
      </div>
    </PageLayout>
  );
};

export default UserPage;
