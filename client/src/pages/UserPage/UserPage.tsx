import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '../../layouts/PageLayout/PageLayout';
import { IUser } from '../../models/IUser';
import $api from '../../app/api/http';
import MyInput from '../../UI/MyInput/MyInput';
import MyButton from '../../UI/MyButton/MyButton';
import styles from './UserPage.module.css';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import { useTranslations } from '../../store/translations';

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { translations } = useTranslations();
  const t = translations();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Partial<IUser>>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user',
    profileImageUrl: '',
  });
  const [profileFile, setProfileFile] = useState<File>();

  useEffect(() => {
    if (isEdit) {
      $api.get<IUser>(`users/${id}`).then(({ data }) => {
        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          profileImageUrl: data.profileImageUrl,
        });
      });
    }
  }, [id, isEdit]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName?.trim()) {
      newErrors.firstName = t.firstNameRequired;
    }

    if (!form.lastName?.trim()) {
      newErrors.lastName = t.lastNameRequired;
    }

    if (!form.email?.trim()) {
      newErrors.email = t.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = t.emailInvalid;
    }

    if (!form.phoneNumber?.trim()) {
      newErrors.phoneNumber = t.phoneRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

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
    Object.entries(form).forEach(([key, val]) => {
      if (val != null) {
        fd.set(key, String(val));
      }
    });

    if (profileFile) {
      fd.set('profileImageUrl', profileFile);
    }

    try {
      if (isEdit) {
        await $api.put(`users/${id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await $api.post('/users/agent', fd);
      }
      navigate(`/users/`);
    } catch (err) {
      console.error(err);
      alert(t.saveError);
    }
  };

  const handleRemove = async () => {
    if (!isEdit || !id) return;

    if (!window.confirm(t.confirmDeleteUser)) {
      return;
    }

    try {
      await $api.delete(`users/${id}`);
      navigate('/users');
    } catch (err) {
      console.error(err);
      alert(t.deleteError);
    }
  };

  return (
    <PageLayout
      actionTitle={isEdit ? t.save : t.create}
      action={handleAction}
      pageTitle={isEdit ? t.editUser : t.createUser}
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
              placeholder={t.firstNamePlaceholder}
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
              placeholder={t.lastNamePlaceholder}
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
              placeholder={t.emailPlaceholder}
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
              placeholder={t.phonePlaceholder}
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
