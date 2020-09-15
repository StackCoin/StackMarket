use std::str;

use s3::bucket::Bucket;
use s3::creds::Credentials;
use s3::region::Region;
use s3::S3Error;
use uuid::Uuid;

struct Storage {
    name: String,
    region: Region,
    credentials: Credentials,
    bucket: String,
    location_supported: bool,
}

const MESSAGE: &str = "I want to go to S3";

pub fn put_presigned_url_with_uuid(bucket: &Bucket, expire_secs: u32) -> Result<String, S3Error> {
    bucket.presign_put(Uuid::new_v4().to_simple().to_string(), expire_secs)
}

pub fn connect_bucket() -> Result<Bucket, S3Error> {
    let dotenv_stackupload_region = dotenv::var("STACKUPLOAD_REGION").unwrap();
    let credentials = Credentials::from_env_specific(
        Some("S3_ACCESS_KEY_ID"),
        Some("S3_SECRET_ACCESS_KEY"),
        None,
        None,
    )?;
    let backend = Storage {
        name: "stackmarket".into(),
        region: dotenv_stackupload_region.parse()?,
        credentials,
        bucket: "stackmarket".to_string(),
        location_supported: true,
    };

    Ok(Bucket::new(
        &backend.bucket,
        backend.region,
        backend.credentials,
    )?)
}

pub async fn upload() -> Result<(), S3Error> {
    let dotenv_stackupload_region = dotenv::var("STACKUPLOAD_REGION").unwrap();
    let backend = Storage {
        name: "stackmarket".into(),
        region: dotenv_stackupload_region.parse()?,
        credentials: Credentials::from_env_specific(
            Some("S3_ACCESS_KEY_ID"),
            Some("S3_SECRET_ACCESS_KEY"),
            None,
            None,
        )?,
        bucket: "stackmarket".to_string(),
        location_supported: true,
    };

    let bucket = Bucket::new(&backend.bucket, backend.region, backend.credentials)?;
    let results = bucket.list("".to_string(), None).await?;

    let (_, code) = bucket.put_object("test_file", MESSAGE.as_bytes()).await?;
    assert_eq!(200, code);

    let (data, code) = bucket.get_object("test_file").await?;
    let string = str::from_utf8(&data)?;
    assert_eq!(200, code);
    assert_eq!(MESSAGE, string);

    bucket
        .put_object_tagging("test_file", &[("test", "tag")])
        .await?;
    let (tags, _status) = bucket.get_object_tagging("test_file").await?;

    let random_bytes: Vec<u8> = (0..3072).map(|_| rand::random::<u8>()).collect();
    let (_, code) = bucket
        .put_object("random.bin", random_bytes.as_slice())
        .await?;
    assert_eq!(200, code);
    let (data, code) = bucket.get_object("random.bin").await?;
    assert_eq!(code, 200);
    assert_eq!(data.len(), 3072);
    assert_eq!(data, random_bytes);

    Ok(())
}
