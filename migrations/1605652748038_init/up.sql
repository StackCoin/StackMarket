CREATE TABLE public.image (
    id text NOT NULL
);
CREATE TABLE public.label (
    id integer NOT NULL,
    listing_id integer,
    tag_id integer
);
CREATE SEQUENCE public.label_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.label_id_seq OWNED BY public.label.id;
CREATE TABLE public.listing (
    id integer NOT NULL,
    store_id integer,
    name character varying,
    sold boolean DEFAULT false NOT NULL,
    price integer,
    created_at timestamp without time zone DEFAULT now(),
    sold_at timestamp without time zone
);
CREATE SEQUENCE public.listing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.listing_id_seq OWNED BY public.listing.id;
CREATE TABLE public.listing_resource (
    resource_name text NOT NULL,
    listing_id integer NOT NULL
);
CREATE TABLE public.resource (
    id integer NOT NULL,
    name text NOT NULL,
    uploaded_at date DEFAULT now() NOT NULL,
    uploaded_by integer
);
CREATE SEQUENCE public.resource_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.resource_id_seq OWNED BY public.resource.id;
CREATE TABLE public.store (
    id integer NOT NULL,
    name character varying,
    created_at timestamp without time zone DEFAULT now(),
    admin integer
);
CREATE VIEW public.store_admin_current AS
 SELECT store.id,
    store.name,
    store.created_at,
    store.admin
   FROM public.store;
CREATE SEQUENCE public.store_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.store_id_seq OWNED BY public.store.id;
CREATE TABLE public.tag (
    id integer NOT NULL,
    store_id integer,
    name character varying
);
CREATE SEQUENCE public.tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.tag_id_seq OWNED BY public.tag.id;
CREATE TABLE public."user" (
    id integer NOT NULL,
    auth0_id character varying,
    full_name character varying,
    created_at timestamp without time zone DEFAULT now(),
    avatar character varying,
    email character varying
);
CREATE VIEW public.user_current AS
 SELECT "user".id,
    "user".auth0_id,
    "user".full_name,
    "user".created_at,
    "user".avatar,
    "user".email
   FROM public."user";
CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
CREATE TABLE public.vendor (
    id integer NOT NULL,
    user_id integer,
    store_id integer,
    created_at timestamp without time zone DEFAULT now()
);
CREATE VIEW public.vendor_current AS
 SELECT vendor.id,
    vendor.user_id,
    vendor.store_id,
    vendor.created_at
   FROM public.vendor;
CREATE SEQUENCE public.vendor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.vendor_id_seq OWNED BY public.vendor.id;
ALTER TABLE ONLY public.label ALTER COLUMN id SET DEFAULT nextval('public.label_id_seq'::regclass);
ALTER TABLE ONLY public.listing ALTER COLUMN id SET DEFAULT nextval('public.listing_id_seq'::regclass);
ALTER TABLE ONLY public.resource ALTER COLUMN id SET DEFAULT nextval('public.resource_id_seq'::regclass);
ALTER TABLE ONLY public.store ALTER COLUMN id SET DEFAULT nextval('public.store_id_seq'::regclass);
ALTER TABLE ONLY public.tag ALTER COLUMN id SET DEFAULT nextval('public.tag_id_seq'::regclass);
ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
ALTER TABLE ONLY public.vendor ALTER COLUMN id SET DEFAULT nextval('public.vendor_id_seq'::regclass);
ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_id_key UNIQUE (id);
ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.listing_resource
    ADD CONSTRAINT listing_resource_pkey PRIMARY KEY (resource_name);
ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_name_key UNIQUE (name);
ALTER TABLE ONLY public.resource
    ADD CONSTRAINT resource_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_auth0_id_key UNIQUE (auth0_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_auth0_id_unique UNIQUE (auth0_id);
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listing(id);
ALTER TABLE ONLY public.label
    ADD CONSTRAINT label_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tag(id);
ALTER TABLE ONLY public.listing_resource
    ADD CONSTRAINT listing_resource_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listing(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.listing_resource
    ADD CONSTRAINT listing_resource_resource_name_fkey FOREIGN KEY (resource_name) REFERENCES public.resource(name) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);
ALTER TABLE ONLY public.store
    ADD CONSTRAINT store_admin_fkey FOREIGN KEY (admin) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.tag
    ADD CONSTRAINT tag_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);
ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.store(id);
ALTER TABLE ONLY public.vendor
    ADD CONSTRAINT vendor_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
