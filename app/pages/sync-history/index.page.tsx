import { Box, Button, Container, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN as string;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

function makeFileObject() {
  const browsingVectors = [[new Date()], [1, 2, 3], [3, 2, 1]];
  const blob = new Blob([JSON.stringify(browsingVectors)], {
    type: "application/json",
  });

  return [new File([blob], "browsing-vectors.json")];
}

async function storeFiles(file: File[]) {
  //create a new file in web3.storage
  const client = makeStorageClient();
  const cid = await client.put(file);
  console.log("stored files with cid:", cid);
  localStorage.setItem("history-vector-cid", cid);
  return cid;
}

export default function SyncHistoryPage() {
  const [titles, setTitles] = useState<string[]>([]);
  useEffect(() => {
    const div = document.querySelector("#history-man");
    if (div) {
      console.log("div",div);
      setTitles(div.innerHTML.split("<br>"));
    }
  }, []);

  return (
    <div>
      <Container maxW={"3xl"} mt={4}>
        <Link href="/">
          <Heading size={"xl"} cursor={"pointer"}>
            Kl
            <Text as={"span"} color={"teal.500"}>
              ei
            </Text>
            o
          </Heading>
        </Link>
        <Heading mt={4}>Connect your browser history</Heading>
        
        <Box mt={4} id="history-titles-list">
          <ul id="list">
            {titles.map((title, index) => {
              return (
                title && (<li className="li-item" key={index}>
                  🌐 {title}
                </li>)
              );
            })}
          </ul>
        </Box>
        <Box mt={8}>
          {titles.length ? (
            <Container>
            
            <Button
              colorScheme={"teal"}
            >
              Generate Passport
            </Button>
            </Container>
          ) : (
            <Button colorScheme={"teal"}>
              Install Extension to Get Started
            </Button>
          )}
        </Box>
        
      </Container>
      <Box bgColor={"teal.500"} py={5} position="fixed" bottom={0} w={"100%"}>
        <Container color="white" textAlign={"center"}>
          Built with no sleep by{" "}
          <a href="https://twitter.com/recurshawn">
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              @recurshawn
            </span>
          </a>{" "}
          &{" "}
          <a href="https://twitter.com/vaibhavgeek">
            <span style={{ fontWeight: "bold", textDecoration: "underline" }}>
              @vaibhavgeek
            </span>
          </a>
        </Container>{" "}
      </Box>
     </div>
  );
}
