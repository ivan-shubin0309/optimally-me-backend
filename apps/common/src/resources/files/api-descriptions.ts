export const ApiDescriptions = {
    postFile: `\n
                1. Client → API Server.
                The client should send a request to the server to notify about the intention to upload the file. Also,
                this request should contain the content-type of file that the client intends to upload. The server
                should generate the name of the file with which it will be stored on s3, prepare the path by which it 
                will be stored, make the necessary records in the database.\n
                2. API Server → AWS API 
                Next, server should send a request for s3 in order to get the data that is needed to upload the file 
                from the client.\n
                3. Client → AWS API
                After receiving a response from the server, the client should send a POST-request 
                for a url which is in the meta object. In this request it is necessary to transfer to formData all 
                fields that are in the formData object of the meta object. You also need to add a field \`file\` as a 
                last field of formData and transfer this the file for uploading.\n
                4. Client → API Server
                After uploading the file, the client should send a request to the server to notify it of the 
                successful upload. Receiving the request, the server must perform all necessary actions, for example, 
                change the status of the file. After that the file can be used where necessary.`
};
