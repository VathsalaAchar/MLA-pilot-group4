package com.authservice.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.ResponseEntity;
import com.authservice.auth.repository.UserRepository;
import com.authservice.auth.model.User;

@SpringBootTest
class AuthserviceApplicationTests {

	@MockBean
	private UserRepository userRepo;

	User user = new User();
	 @BeforeEach
    public void setup() {
        // Add test user to the database
        
        user.setUsername("testUser");
        user.setPassword("testPassword");
        userRepo.save(user);
    }
	@Test
	void SignUpTest() {
		when(userRepo.existsByUsername("testUser"))
		.thenReturn(true) ;
		assertTrue(userRepo.existsByUsername("testUser"));

	}

	@Test
	void loginTest(){
		when(userRepo.findByUsername("testUser"))
		.thenReturn(user);
       assertEquals(userRepo.findByUsername("testUser").getUsername(), "testUser");   
	}





}
